import {Effect,Exit,Cause} from "effect";

const add = (a:number,b:number) => 
  Effect.suspend(() =>
    a>0 && b>0 ? Effect.succeed(a+b) : Effect.fail(new Error("Both numbers must be positive"))
  );

const prog = Effect.runSyncExit(add(10,10));

Exit.match(prog,{
  onSuccess: (result) => console.log("Result:", result),
  onFailure: (error) => {
    if (Cause.isFailType(error)) {
      console.log("Error:", error.error.message);
    }
  }
})

console.log(add(10,10));
