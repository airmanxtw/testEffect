import {Effect,Exit,Cause} from "effect";

const add = (a:number,b:number) => 
  Effect.suspend(() =>
    a>0 && b>0 ? Effect.succeed(a+b) : Effect.fail(new Error("Both numbers must be positive"))
  );

const prog = Effect.runSyncExit(add(10,10));

Exit.match(prog,{
  onSuccess: (result) => console.log("Result:", result),
  onFailure: (error) => {
    Cause.match(error,{
      onEmpty: () => console.error("Empty cause"),
      onFail: (err) => () => { console.error("Empty cause"); },
      onDie: (die) => () => { console.error("Empty cause"); },
      onInterrupt: (fiberId) => () => { console.error("Empty cause"); },
      onSequential: (left, right) => () => { console.error("Empty cause"); },
      onParallel: (left, right) => () => { console.error("Empty cause"); }
    })
  }
  }
})

console.log(add(10,10));
