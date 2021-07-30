export interface ServerSingleResponse<Type> {
    data: Type;
  }
  
  export interface ServerMultipleResponse<Type> {
    data: Array<Type>
  }