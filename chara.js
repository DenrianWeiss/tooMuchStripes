'use strict';

let global_VM_info = {
    'registers': {
        'l||': 0,
        'l|l': 0,
        'l|I': 0,
        'll|': 0,
        'lll': 0,
        'llI': 0,
        'lI|': 0,
        'lIl': 0,
        'lII': 0,
    },
    'overflow': 0,
    'stack': [],
    'program_counter': 0
}

let vmi = [];

let instructions = {
    'll|': (args) => { // Load
        let register = args.trim().substr(0, 3);
        global_VM_info['registers'][register] = parseUncertainArg(args.trim().substr(3));
    },
    'lll': (args) => { // Add
        let register = args.trim().substr(0, 3);
        let res = global_VM_info['registers'][register] +
            parseUncertainArg(args.trim().substr(3));
        global_VM_info['overflow'] = (res > 65535);
        global_VM_info['registers'][register] = res % 65536;
    },
    'llI': (args) => { // Minus
        let register = args.trim().substr(0, 3);
        let res = global_VM_info['registers'][register] -
            parseUncertainArg(args.trim().substr(3));
        global_VM_info['overflow'] = (res < 0);
        global_VM_info['registers'][register] = (res + 65536) % 65536;
    },
    'l||': (args) => { // Push
        global_VM_info['stack'].push(parseUncertainArg(args));
    },
    'l|l': (args) => { // Pop
        let register = args.trim().substr(0, 3);
        global_VM_info['registers'][register] = global_VM_info['stack'].pop();
    },
    'l|I': (args) => { // Stack add
        let res = global_VM_info['stack'].pop() + global_VM_info['stack'].pop();
        global_VM_info['overflow'] = (res > 65535);
        global_VM_info['stack'].push(res % 65536);
    },
    '|||': (args) => {
        if (global_VM_info['overflow']) {
            global_VM_info['program_counter'] = parseUncertainArg(args) - 1;
        }
    },
    '||l': (args) => {
        let register = args.trim().substr(0, 3);
        let res = global_VM_info['registers'][register];
        if (global_VM_info['registers']['l||'] === res) {
            global_VM_info['program_counter'] = parseUncertainArg(args.trim().substr(3)) - 1;
        }
    },
    '||I': (args) => {
        let register = args.trim().substr(0, 3);
        let res = global_VM_info['registers'][register];
        if (global_VM_info['registers']['l||'] < res) {
            global_VM_info['program_counter'] = parseUncertainArg(args.trim().substr(3)) - 1;
        }
    },
    'III': (args) => {
        let register = args.trim().substr(0, 3);
        global_VM_info['registers'][register] = inputOp();
    },
    'II|': (args) => {
        outputOp(parseUncertainArg(args));
    }
}

let inputOp = () => {
    // Please impl. by your self.
}

let outputOp = ( val ) => {
    if(val > 127) {
        console.log(val);
    }
    else {
        console.log(String.fromCharCode(val));
    }
}

const halt = () => {

}

const VMException = ( reason ) => {
    return `At line ${global_VM_info['program_counter']}: ${reason}`;
}

const preProcess = ( str ) => {
    let processed_str = str;
    processed_str = processed_str.replace(/i/g, 'I');
    processed_str = processed_str.replace(/L/g, 'l');
    return processed_str;
}

const prepareVMInstruction = ( str ) => {
    vmi = preProcess(str).split(/[\s\n]/);
}

const processLine = ( str ) => {
    str.trim()
}

const getTernary = ( str ) => {
    let processed_str = str;
    let result = 0;
    const legal_char_set = ['0', '1', '2'];
    processed_str = processed_str.replace(/\|/g, '0');
    processed_str = processed_str.replace( /l/g, '1');
    processed_str = processed_str.replace( /I/g, '2');
    for (let i = 0; i < processed_str.length ; i++) {
        if(!(processed_str[i] in legal_char_set)) {
            VMException(`Parser error: '${processed_str[i]}' is not a legal character here.`);
            return -1;
        }
        result = result * 3 + parseInt(processed_str[i]);
    }
    return result;
}

const parseInstantNum = ( str ) => {
    let result = 0;
    if(str[1] in {
        'l': 1,
        'I' : 1,
        '|': 1}) {
        result = getTernary(str.substring(1));
    }
    else {
        result = parseInt(str.substring(1), 10);
    }
    if(isNaN(result) || result < 0) {
        halt();
    } else {
        return result;
    }
}

const parseUncertainArg = ( str ) => {
    str = str.trim();
    if(str[0] == 'i' || str[0] == 'I') {
        return parseInstantNum(str) % 65536;
    }
    else if(str[0] === 'l') {
        return global_VM_info['registers'][str];
    }
    else {
        VMException(`Parse error: Unexpected token at ${str}`);
        halt();
    }
}

let updateUI = () => { // Need impl.
}

const runStep = () => {
    let asm = vmi[global_VM_info['program_counter']].trim();
    instructions[asm.substr(0,3)](asm.substr(3));
    global_VM_info['program_counter'] += 1;

}

const entry = ( commands ) => {
    // Prepare VM Instructions
    prepareVMInstruction(commands);
    while (vmi[global_VM_info['program_counter'] !== undefined]) {
        runStep()
    }
}

// Hello World demo.

entry('II|i72\n' +
    'II|i101\n' +
    'II|i108\n' +
    'II|i108\n' +
    'II|i111\n' +
    'II|i32\n' +
    'II|i87\n' +
    'II|i111\n' +
    'II|i114\n' +
    'II|i108\n' +
    'II|i100')
