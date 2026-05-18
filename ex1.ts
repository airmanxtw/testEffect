import {Effect,Exit,Cause} from 'effect'
import { pipe } from "effect/Function";

type User = {
    email:string;
    password:string;
}

const loginUser = (user:User) => user

const validateEmailRequire = (user:User) => 
    Effect.if(!!user.email,{
        onTrue: () => Effect.succeed(user),
        onFalse: () => Effect.fail("Email is required")
    })

const validateEmailFormat = (user:User) =>
    Effect.if(user.email.includes("@"),{
        onTrue: () => Effect.succeed(user),
        onFalse: () => Effect.fail("Email is Invalid")
    })

const valdatePasswordRequire = (user:User) =>
    Effect.if(!!user.password,{
        onTrue: () => Effect.succeed(user),
        onFalse: () => Effect.fail("Password is required")
    })

const valdatePasswordLength = (user:User) =>
    Effect.if(user.password.length >= 6,{
        onTrue: () => Effect.succeed(user),
        onFalse: () => Effect.fail("Password must be at least 6 characters")
    })

const validateUser = (user:User) =>
    pipe(
        validateEmailRequire(user),
        Effect.flatMap(validateEmailFormat),
        Effect.flatMap(valdatePasswordRequire),
        Effect.flatMap(valdatePasswordLength),
        Effect.map(loginUser)                
    )

const prog = Effect.runSyncExit(validateUser({email:"test@example,com",password:"123456"} as User))

Exit.match(prog,{
    onFailure: (error) => console.error("Validation failed:",Cause.squash(error) as string),
    onSuccess: (user) => console.log("Validation succeeded:", user)
})
