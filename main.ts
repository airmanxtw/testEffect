// https://fakestoreapi.com/

import {Effect,Exit,Cause} from "effect";
import axios from "axios";
import type {AxiosError} from "axios";
import { pipe } from "effect/Function";
import { validateEither } from "effect/Schema";
import { get } from "node:http";


type User ={
  id:number;
  email:string;
  username:string;
}

// 用正則表達式驗證 email 格式

const validateEmail = (email:string) =>
Effect.if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),{
  onTrue: () => Effect.succeed(email),
  onFalse: () => Effect.fail(`Invalid email format: ${email}`)
})



const getUserByid = (id:number) =>
  Effect.tryPromise({
    try: () => axios.get<User>(`https://xfakestoreapi.com/users/${id}`).then(res => res.data),
    catch: (error:unknown) => `error msg: ${(error as AxiosError).message}`
  })



const validateUserEamil = pipe(
                1,
               
                (id)=>getUserByid(id), 
                (user)=>Effect.flatMap(user,u=>validateEmail(u.email))
              )

const validateUserEamil0 = pipe(
                1,
                getUserByid, 
                Effect.flatMap(u=>validateEmail(u.email))
              ) 
              
              
const getdata = (token:string) =>(id:number) =>   id;

const getdataBytoken = getdata("token");



getdataBytoken(1);



const validateUserEamil2 = Effect.gen(function*(){
  const user = yield* getUserByid(1);
  const email = user.email;
  const validEmail = yield* validateEmail(email);
  return validEmail;
})

const validateUserEamil3 = getUserByid(1).pipe(Effect.flatMap(user=>validateEmail(user.email)))

const validateUserEamilProg = Effect.runPromiseExit(validateUserEamil);

const validateUserEamilProg2 = Effect.runPromise(validateUserEamil);

validateUserEamilProg2
.then(email=>console.log(`Valid email: ${email}`))
.catch(error=>console.error(`Error: ${Cause.squash(error) as string}`))

console.log("Program start");

const run = async () =>{

  Exit.match(await validateUserEamilProg,{
  onSuccess:(email)=>console.log(`Valid email: ${email}`),
  onFailure:(error)=>console.error(`Error: ${Cause.squash(error) as string}`)
 
})
}

run();


console.log("Program end");
  



  

// effectful function

