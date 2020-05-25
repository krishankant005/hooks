import React, { useState, useEffect,useRef } from 'react';
import useHttp from '../../hook/http';
import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const{onLoadIngredient}= props;
  const [enteredInput,setEnteredInput] = useState('');
  const inputRef = useRef();
  const {isLoading,data,error,sendRequest,clear} =useHttp();

  useEffect( () =>{
    const timer = setTimeout(() =>{
      if (enteredInput === inputRef.current.value)
      {
        const query = enteredInput.length ===0 ? '' :  `?orderBy="title"&equalTo="${enteredInput}"`;
      
      sendRequest('https://react-hooks-971c8.firebaseio.com/ingredients.json'+query,'GET');
      
    } 
    },500);
    return () => {
      clearTimeout(timer);
    };
  },[enteredInput,inputRef,sendRequest]);

useEffect( () =>{
  if(!isLoading && ! error && data ){
    const loadingIngredients = [];
    for(const key in data ){
      loadingIngredients.push({
        id: key,
        title : data[key].title,
        amount : data[key].amount
      });
    }
    onLoadIngredient(loadingIngredients);
  }
},[data,isLoading,error,onLoadIngredient]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>..Loading</span>}
          <input ref = {inputRef} type="text" value ={enteredInput}
            onChange={event => setEnteredInput(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
