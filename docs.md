# CharaVM Docs

CharaVM is an esoteric programming language that only use character `I`,`l` and `|`.

## VM Architecture

### Storage

 CharaVM have an infinity stack and 9 registers, besides, an overflow signal bit, `|||`.  
 Registers are:
 - l||
 - l|l
 - l|I
 - ll|
 - lll
 - llI
 - lI|
 - lIl
 - lII
 
 All registers are generic purpose, and can storage integer up to 65535.
 
 ### Calling convention
 
 In CharaVM, caller is responsible for saving and recover the value of register, and the first argument should be in `l|l`, since `l||` is for return value.
 
 ## VM Assembly
 
 ### Assembly format
 
 Any instruction should obey the following rule:
 
 * First argument in most cases should be register address.
 * Instant number should begin with i, for example: `i11451`, `-i1919`
 * Ternary is accepted. (| for 0, l for 1, I for 2, like ilI|I|l|l|(120201010) = i114514)
 * Registers should begin with l. (for example, l||)
 
 Assembly Example: `||| l||,i1145`
 
 ### Instructions
 
 #### Variable operations
 
 * load(ll|)  
   Load the value of second argument(Instant number/Register) into the first one.  
   Example: `ll| <register address> <instant num/Register>`
 * add(lll)  
   Add the value of second argument(Instant number/Register) into the first one, and save at the first one.  
   If overflow occurred, `|||` will be set to 1.  
   Example: `lll <register address> <instant num/Register>`
 * min(llI)  
   Same as add.
   
 
 #### Stack operations
 
 * push(l||)
   push a value into stack.
   Example: `l|| <register/ Instant value>`
 * pop(l|l)
   pop a value into register.
   Example: `l|l <register>`
 * adds(l|I)  
   pop the top two number on the stack, then add them and push it back.  
   Example: `l|I`
 
 #### Jump instructions
 
 * jmpof(|||)  
   Jump if overflow.
   Example: `||l <register/instant number>`
 * jmpeq(||l)  
   Jump if first argument is equal to the `l||`.  
   Example: `||l <register> <target address(register/instant number)>`
 * jmpgt(||I)  
   Jump if first argument is bigger than the `l||`.  
   Example: `||I  <register> <target address(register/instant number)>`
   
 #### I/O Instructions
 
 * recv(III)  
   Receive an input, ascii char will be automatically converted to int.  
   Example: `III <register>`
 * puts(II|)  
   Output a character.  
   Example: `II| <register/Instant value>`

