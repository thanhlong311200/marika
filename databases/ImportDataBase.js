const xlsx = require('node-xlsx');
const RecipesMeal = require("../models/RecipesMeal.model");
const RecipesDietary = require("../models/RecipesDietary.model");
const Dietary = require("../models/Dietary.model");
const IngredientsCategory = require("../models/IngredientsCategory.model");
const Ingredients = require("../models/Ingredients.model");
const Recipes = require("../models/Recipes.model");
const MenuFood = require("../models/MenuFood.model");
const MealPlan = require("../models/MealPlan.model");

const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/marikaday"
const connectionDatabase = async () => {
  await mongoose.connect(uri, {
    useUnifiedTopology: true, useNewUrlParser: true,
  })
}

async function insertToRecipesContentCollection(data, recipeMeals, ingre) {
  const getMealId = (name) => {
    const recipe = recipeMeals.find(e => e.name.search(name.toLowerCase()) >= 0)
    return recipe?._id || '';
  }

  return (await Promise.all(data.map(async (dt, index) => {
    if (index <= 1) return null
    try {
      const methodData = dt[9]?.split('\n') || []
      const dataInsert = {
        id: dt[0],
        mealId: getMealId(dt[1]),
        name: dt[2],
        typeId: dt[1],
        description: dt[3],
        serves: dt[4],
        price: dt[5],
        time: dt[6],
        dietaries: dt[7].split(','),
        note: dt[8],
        method: [...methodData.map((m, index) => ({step: index + 1, content: m}))],
        ingredients: [],
        nutritionInformation: [{field: 'calories', value: dt[10]}, {field: 'protein', value: dt[11]}, {
          field: 'carbs',
          value: dt[12]
        }, {field: 'fats', value: dt[13]}, {field: 'fibre', value: dt[14]}],
      }
      // console.log(dataInsert)
      const newRecipe = new Recipes({...dataInsert})
      await newRecipe.save()
      return null
    } catch (e) {
      console.log(e)
      return `data error: ${data[0]}`
    }
  }))).filter(e => e)
}

async function updateToRecipesContentCollection(dataRecipes, dataIngredients = [], dataDietaries = [], dataIngredientsExcel = []) {

  const getNameIngredients = (recipeId = '') => {
    const ingredient = dataIngredientsExcel.filter(e => e[0] === recipeId);
    if (!ingredient?.length) return []
    return ingredient.map(ing => {
      return {name: ing[5] || '', qty: ing[3]}
    })
  }

  const getIngredientIds = (names = []) => {
    const ingredients = names.map(name => {
      const ind = dataIngredients.find(ind => ind.name === name.name);
      return {_id: ind?._id, qty: name.qty || 0}
    })
    return ingredients || []
  }

  const getDietaries = (dietaryID = '') => {
    const ingredient = dataDietaries.find(e => e._doc.id === dietaryID);
    // console.log({ingredient})
    return ingredient?._id || ''
  }

  return (await Promise.all(dataRecipes.map(async (dt, index) => {

    if (index <= 1) return null
    try {
      // update ingredient.

      const names = getNameIngredients(dt[0])
      const ingredients = getIngredientIds(names)
      // console.log(ingredients)

      //update dietaries
      const idDietaries = dt[7]?.split(',')?.map(e => e?.trim());
      // console.log(idDietaries)
      if (!idDietaries?.length) {
        await Recipes.findOneAndUpdate({id: dt[0]}, {
          $set: {ingredients, dietary: []}
        })
        return null
      }
      console.log({idDietaries})
      const dietary = idDietaries.map(die => {
        return getDietaries(die);
      }).filter(e => e) || []
      console.log({dietary})

      await Recipes.findOneAndUpdate({id: dt[0]}, {
        $set: {ingredients, dietary}
      })

      return null
    } catch (e) {
      console.log(e)
      return `data error: ${dt[0]}`
    }
  }))).filter(e => e)
}

async function insertRecipeCategories(data) {
  console.log("insertToDietryRecipeCategories...")
  return (await Promise.all(data.map(async (dt, index) => {
    if (index <= 1) return null
    try {
      if (!dt[5] || !dt[6]) return null
      const ingreCategoryInsert = {
        name: dt[5], description: dt[6],
      }
      const ingreCategory = new IngredientsCategory({...ingreCategoryInsert})
      await ingreCategory.save()

      return null
    } catch (e) {
      console.log(e)
      return `data error: ${data[0]}`
    }
  }))).filter(e => e)

}

async function insertRecipeDietary(data) {
  return (await Promise.all(data.map(async (dt, index) => {
    if (index <= 1) return null
    try {
      const dietaryInsert = {
        id: dt[0], name: dt[1], description: dt[2],
      }
      console.log("insertDietry...", dietaryInsert)
      const newRecipe = new RecipesDietary({...dietaryInsert})
      await newRecipe.save()

      return null
    } catch (e) {
      console.log(e)
      return `data error: ${data[0]}`
    }
  }))).filter(e => e)
}

async function insertToRecipesIngredients(data, ingreCategordy) {
  console.log("insertToRecipesIngredients...", ingreCategordy.length)
  const getIngreCategoryId = (name) => {
    if (!name) return ""
    const recipe = ingreCategordy.find(e => e.name.search(name) >= 0)
    return recipe?._id || '';
  }
  return (await Promise.all(data.map(async (dt, index) => {
    if (index <= 1) return null
    try {
      const ingredientsInsert = {
        unit: dt[4] || '',
        name: dt[5] || '',
        categoryId: getIngreCategoryId(dt[1]) || undefined
      }
      console.log({ingredientsInsert});
      const ingredient = new Ingredients(ingredientsInsert)
      await ingredient.save()
      return null
    } catch (e) {
      // console.log(e)
      return `data error: ${dt[0]}`
    }
  }))).filter(e => e)
}

async function insertToServe(data) {
  console.log("insertToServe...")
}

const insertData = async (dataSheets) => {
  await connectionDatabase()
  // const recipeMeals = await RecipesMeal.find()
  const ingreCategordy = await IngredientsCategory.find()
  const isUpdateRecipe = true
  const dataIngredientsExcel = dataSheets.find(da => da.name === 'Recipes Ingredients')
  console.log(dataIngredientsExcel.name, dataIngredientsExcel.data.length)
  const dataIngreDb = await Ingredients.find();
  const dataRecipeDietaryDb = await RecipesDietary.find();

  dataSheets.forEach((data, index) => {
    console.log(data.name)
    if (data.name === 'Recipes Content Collection' && !isUpdateRecipe) {
      // insertToRecipesContentCollection(data.data, recipeMeals).then(data => console.log(data)).catch(e => console.log(e)).finally()
    }
    if (data.name === 'Recipes Content Collection' && isUpdateRecipe) {
      // updateToRecipesContentCollection(data.data, dataIngreDb, dataRecipeDietaryDb, dataIngredientsExcel.data).then(data => console.log(data)).catch(e => console.log(e)).finally()
    }
    if (data.name === 'Dietry & Recipe Categories') {
      // insertRecipeCategories(data.data).then().catch(e => console.log(e)).finally()
      // insertRecipeDietary(data.data).then().catch(e => console.log(e)).finally()
    }
    if (data.name === 'Recipes Ingredients') {
      // insertToRecipesIngredients(data.data, ingreCategordy).then(e => console.log(e)).catch(e => console.log(e)).finally()
    }
    if (data.name === 'To serve') {
      // insertToServe(data.data).then().catch(e => console.log(e))
    }
  })
}

const insertDietary = async (dataSheets) => {
  const dietaries = ['REG', 'VEGE', 'VEGAN'].map(data => {
    return new Dietary({name: data, description: ''})
  })
  await Dietary.insertMany(dietaries)
}

const insertDEMOMenufood = async (data, recipes, recipeMeals) => {
  // console.log(data.length, recipes.length)

  const demoRandomRecipeId = () => {
    // Returns a random integer from 1 to 100:
    const randomIndex = Math.floor(Math.random() * 187) + 1;
    return recipes[randomIndex]?._id;
  }

  const getMealId = (name) => {
    const recipe = recipeMeals.find(e => e.name.search(name.toLowerCase()) >= 0)
    return recipe?._id || '';
  }

  for (let i = 0; i < 100; i++) {
    const randomIdx = Math.floor(Math.random() * 9) + 1;
    const randomMealId = recipeMeals[randomIdx]?._id

    const menuFood = {
      date: '',
      mealId: randomMealId,
      recipe: demoRandomRecipeId()
    }

    const menuFSave = new MenuFood(menuFood)
    await menuFSave.save()
  }

}

const diffNameMeal = ['Crispy Barramundi & Chippies', 'Teriyaki Salmon w/ Rice and Greens', 'Simple Berry Overnight Oats',
  'Warm Veggie Cous Cous Salad', 'Pumpkin Lasagne', 'Pulse Pasta w/ Roast Veggies and Fetta',
  'Vegan Mexican Dump & Bake', 'Healthy Mac and Cheese', 'Stuffed Sweet Potatoes with Crispy Chickpeas + Creamy Tahini Dressing',
  'Bangers and Mash', 'Pumpkin Lentil Soup', 'Choc PB Chia Pudding', 'Deconstructed Rice Paper Rolls', 'Mongolian Tofu Stirfry',
  'Miso Soba Noodle Salad'
]
const diffNameRecipe = ['CRISPY SKIN BARRAMUNDI AND CHIPPIES', 'TERIYAKI SALMON WITH RICE AND GREENS', 'SIMPLE BERRY OVERNIGH TOATS',
  'WARM VEGGIE COUSCOUS SALAD', 'PUMPKIN & CHICKEN RISOTTO', 'PULSE PASTA WITH ROAST VEGGIES AND FETA',
  'VEGAN MEXICAN DUMP + BAKE', 'HEALTHY MAC & CHEESE', 'SWEET POTATOES WITH CRISPY CHICKPEAS', 'BANGERS AND MASH',
  'PUMPKIN AND LENTIL SOUP', 'CHOC PB CHIA PUDDING', 'DECONSTRUCTED TOFU RICE PAPER ROLLS', 'MONGOLIAN TOFU STIR FRY',
  'MISO SALMON SOBA NOODLE SALAD'
]

const insertMealToDb = async (data, menuFoods, dietaryId, name, dataRecipe, nameDie) => {
  const {
    recipes,
    recipeMeals
  } = dataRecipe
  const meal = {
    name: name,
    dietaryId: dietaryId,
    numberOfSnack: name === 'Healthy' ? 2 : 3,
    data: []
  }
  const getMenuFId = async (name, recipeMealId) => {
    try {
      console.log(name, nameDie)
      if (!recipeMealId) return undefined
      if (!name) return null
      let nameMeal = name?.trim()
      const inDiff = diffNameMeal.findIndex(e => e === nameMeal);
      if (inDiff >= 0) {
        nameMeal = diffNameRecipe[inDiff];
      }
      let recipe = recipes.find(rec => rec?.name?.trim().search(nameMeal?.toUpperCase()) !== -1)
      if (!recipe) {
        let idx = 0;
        const taskChar = nameMeal.toUpperCase().split(" ");
        while (idx < taskChar?.length && !recipe) {
          if (!taskChar[idx] || taskChar[idx] === 'AND' || taskChar[idx].length <= 1)
            idx++;
          else {
            recipe = recipes.find(rec => rec?.name?.includes(taskChar[idx] + " ") || rec?.name?.includes(" " + taskChar[idx]));
            idx++;
          }
        }
      }
      if(!recipe?.name)
        console.log(nameMeal.toUpperCase(),"=> FIND => ", recipe?.name);
      const menu = menuFoods.find(e => e?.mealId?.equals(recipeMealId) && e?.recipe?.equals(recipe?._id))
      if (!menu) {
        const newMenuFood = new MenuFood({mealId: recipeMealId, recipe: recipe?._id})
        await newMenuFood.save()
        return newMenuFood._id || null
      }
      return menu?._id || null
    } catch (e) {
      console.log(e);
      return null
    }
  }
  let weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  for (const newMeal of data) {
    const index = data.indexOf(newMeal);
    if (newMeal[0] && newMeal[0].search('WEEK') >= 0) {
      let snack = 0;
      const getRecipeId = (recipeMealName) => {
        if (!recipeMealName) return null;
        if (recipeMealName.search('Snack') >= 0) {
          snack++;
          recipeMealName = `${recipeMealName} ${snack}`
        }
        let recipeId = recipeMeals.find(rec => rec?.name?.toLowerCase() === recipeMealName?.toLowerCase())?._id || null
        return recipeId
      }
      for (let j = 1; j <= 7; j++) {
        snack = 0;
        // console.log("=============== >>>>> Week day: ", {DayInWeek: weekday[j - 1]})
        const menuMealPlan = [
          await getMenuFId(data[index + 1][j], getRecipeId(data[index + 1][0])),
          await getMenuFId(data[index + 2][j], getRecipeId(data[index + 2][0])),
          await getMenuFId(data[index + 3][j], getRecipeId(data[index + 3][0])),
          await getMenuFId(data[index + 4][j], getRecipeId(data[index + 4][0])),
          await getMenuFId(data[index + 5][j], getRecipeId(data[index + 5][0])),
          await getMenuFId(data[index + 6][j], getRecipeId(data[index + 6][0])),
          await getMenuFId(data[index + 7][j], getRecipeId(data[index + 7][0]))
        ]
        const dataPlan = {
          day: weekday[j - 1],
          menuFood: [...menuMealPlan].filter(e => e !== undefined)
        }
        meal.data.push(dataPlan)
      }
    }
  }

  // meal.data.map(e => console.log(e))
  const mealSave = new MealPlan(meal)
  await mealSave.save()
}

const insertMealPlan = async (dataSheets) => {
  await connectionDatabase()

  // await insertDietary(dataSheets)

  const recipes = await Recipes.find();
  const recipeMeals = await RecipesMeal.find()
  const dataRecipe = {
    recipes,
    recipeMeals
  }
  const dietaries = await Dietary.find()
  const getDietaryId = (nameDie) => {
    const die = dietaries.find(e => e._doc.name === nameDie)
    return die?._id
  }
  const nameMeals = ['Healthy', 'Nourished', 'Active']
  const nameDietaries = ['REG', 'VEGE', 'VEGAN']
  // Trong file excel can sap xep dung thu tu nhu tren insert moi dung.

  let mealIdx = -1;
  for (const data of dataSheets) {
    const idx = dataSheets.indexOf(data);

    //get meal name
    const nameMeal = nameMeals[idx % 3]

    //get dietary id
    if (idx % 3 === 0) {
      mealIdx++;
    }
    const nameDie = nameDietaries[mealIdx]
    const dieId = getDietaryId(nameDie)

    console.log(`${nameDie} + ${nameMeal}`, dieId)
    const foods = await MenuFood.find()
    await insertMealToDb(data.data, foods, dieId, nameMeal, dataRecipe, nameDie)
  }
  await mongoose.disconnect()
}

(() => {
  const dataSheets = xlsx.parse(__dirname + '/Sentius_Marika_Day_Recipes_211021.xlsx'); // parses a file
  const dataSheetsMealPlan = xlsx.parse(__dirname + '/Fuelled Meal Plan.xlsx'); // parses a file
  // console.log(dataSheets[1].data[1])
  const indexInsert = 1

  // if (indexInsert === 0)
  //   insertData(dataSheets).then()
  // else
  // if (indexInsert === 1)
  //   insertMealPlan(dataSheetsMealPlan).then()

})()
