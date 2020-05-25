import {useReducer, useCallback} from 'react';

const initialState={
    loading:false,
        error:null,
        data: null,
        extra: null,
        reqType: null
};
const httpReducer = (curHttpstate,action) =>{
    switch(action.type){
      case "SEND":
        return {loading: true,error: null,data:null,extra: null,reqType:action.reqType};
      case "RESPONSE":
        return{...curHttpstate,loading:false,data: action.responseData,extra: action.extra};
        case 'ERROR':
          return { loading: false, error: action.errorMessage };
        case 'CLEAR':
          return initialState;
      default:
        throw new Error("should not reach here.")
    }
  };

const useHttp = () =>{
    const [httpstate,dispatchHttp] = useReducer(httpReducer,initialState);

    const clear =useCallback(() => {dispatchHttp({type:'CLEAR'})},[]);
    const sendRequest = useCallback((url,method,body,reqExtra,reqType) =>{
        dispatchHttp({ type: 'SEND' , reqType: reqType});
        fetch(url,
            {
            method: method,
            body: body,
            headers:{
                'Content-Type':'applicaion/json'
            }
        }).then(response =>{return response.json();}
      ).then(responseData =>{
        dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra:reqExtra});
      })
      .catch(error =>{
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
      },[])
      return{
          isLoading:httpstate.loading,
          data: httpstate.data,
          error: httpstate.error,
          sendRequest: sendRequest,
          extra: httpstate.extra,
          reqType: httpstate.reqType,
          clear:clear
      }
};

export default useHttp;