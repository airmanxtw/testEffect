// https://fakestoreapi.com/

import {Effect,Exit,Cause} from "effect";
import axios from "axios";
import type {AxiosError} from "axios";
import { pipe } from "effect/Function";


type User ={
  id:number;
  email:string;
  username:string;
}

// 使用正則表達式驗證 email 格式
const isEmail = (email:string) => Effect.if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),{
  onTrue: () => Effect.succeed(email),
  onFalse: () => Effect.fail(new Error(`Invalid email format: ${email}`))
})

const getUser = (id:number) => Effect.tryPromise({
  try: () => axios.get(`https://jsonplaceholder.typicode.com/users/${id}`).then(res => res.data as User),
  catch: (error) => new Error(`Failed to fetch user with id ${id}: ${(error as AxiosError).message}`)
})

const updateUser = (newData:User) => Effect.tryPromise({
  try: () => axios.put(`https://jsonplaceholder.typicode.com/users/${newData.id}`, newData).then(res => res.data as User),
  catch: (error) => new Error(`Failed to update user with id ${newData.id}: ${(error as AxiosError).message}`)
})

const changeUserEmail = (newMail:string) => (data:User) => ({...data, email: newMail} as User);

const getUserAndChangeEmail = (id:number, newMail:string) =>
  pipe(
    getUser(id),
    Effect.map(changeUserEmail(newMail)),
    Effect.flatMap(updateUser)
  )

const getUserAndChangeEmailWithValidation = (id:number, newMail:string) => Effect.gen(function* (){
  const user = yield* getUser(id);
  const validEmail = yield* isEmail(newMail);
  const updatedUser = changeUserEmail(validEmail)(user);
  return yield* updateUser(updatedUser);
});

const prog = Effect.runPromiseExit(getUserAndChangeEmailWithValidation(1,'abc'));

Exit.match(await prog,{
  onSuccess: (user) => console.log("User fetched successfully:", user),
  onFailure:(error)=> console.log("Error fetching user:",(Cause.squash(error) as Error).message )
})