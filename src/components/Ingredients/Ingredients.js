import React, { useReducer,useCallback, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hook/http';

const ingredientReducer = (currentIngredients,action) =>{
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients,action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error("shouldn't be reach.");
  }
};



const Ingredients = () => {
  const [userIngredients,dispatch] = useReducer(ingredientReducer,[]);
  const {isLoading,data,error,sendRequest,extra,reqType,clear} = useHttp();
  
  //const [userIngredients,setUserIngredients] = useState([]);
  // const[isLoading,setIsLoading]= useState(false);
  // const [error,setError] = useState();

  useEffect(() =>{
    if(!isLoading && !error && reqType === 'DELETE'){
      dispatch({type:"DELETE",id: extra});
    }else if(!isLoading && reqType === 'ADD'){
      dispatch({type: 'ADD',ingredient:{id: data.name,...extra}})
    }
    
  },[data,extra,reqType,isLoading,error]);
 
  const addIngredientHandler = useCallback( ingredient =>{
    sendRequest('https://react-hooks-971c8.firebaseio.com/ingredients.json','POST',
                JSON.stringify(ingredient),
                ingredient,
                'ADD');
    // dispatchHttp({type:"SEND"});
    // fetch('https://react-hooks-971c8.firebaseio.com/ingredients.json',{
    //   method:'POST',
    //    body: JSON.stringify(ingredient),
    //    headers: {'Content-Type': 'application/json'}
    // }).then(response => {
    // //  setIsLoading(false);
    //   dispatchHttp({type:"RESPONSE"});
    //   return response.json();
    // }).then(responseData =>{
    //   dispatch({type:"ADD", 
    //   ingredient:{id: responseData.name,...ingredient}});
    //   // setUserIngredients(prevIngredients =>
    //   //   [...prevIngredients,{id: responseData.name, ...ingredient}
    //   //   ]);
    // });
    
  },[sendRequest]);

  const removeIngredientHandler = useCallback(ingredientId =>{
    sendRequest(`https://react-hooks-971c8.firebaseio.com/ingredients/${ingredientId}.json`,
    'DELETE',
    null,
    ingredientId,
    'DELETE');
    //setIsLoading(true);
    // dispatchHttp({type:"SEND"});
    // fetch(`https://react-hooks-971c8.firebaseio.com/ingredients/${ingredientId}.json`,{
    //   method:'DELETE'
    // }).then(response =>{
    //   dispatchHttp({ type: 'RESPONSE' });
    //     // setUserIngredients(prevIngredients =>
    //     //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    //     // );
    //     dispatch({ type: 'DELETE', id: ingredientId });
    // }
    // ).catch(error =>{
    //   dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
    // });
    
  },[sendRequest]) ;

  const filteredIngredientHandler = useCallback(fliterIngredient =>{
    dispatch({type:"SET",ingredients:fliterIngredient});
    //setUserIngredients(fliterIngredient);
  },[]);



  const ingredientList = useMemo( () =>{
    return <IngredientList ingredients 
    = {userIngredients} onRemoveItem ={removeIngredientHandler}/>
        
  },[userIngredients,removeIngredientHandler]);
  return (
    
    <div className="App">
      {error
       && (<ErrorModal onClose= {clear}>{error}</ErrorModal>
       )}
      <IngredientForm onAddIngredient = {addIngredientHandler}
       loading={isLoading}/>

      <section>
        <Search onLoadIngredient ={filteredIngredientHandler}/>
         {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
