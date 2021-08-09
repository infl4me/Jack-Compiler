import path from 'path';
import { promises as fs } from 'fs';
import { parse, tokenize } from '../src';
import { compile } from '../src/compile';

test('compile Seven', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Seven', 'Main.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function Main.main 0
    push constant 1
    push constant 2
    push constant 3
    call Math.multiply 2
    add
    call Output.printInt 1
    pop temp 0
    push constant 0
    return"
  `);
});

test('compile ConvertToBin', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'ConvertToBin', 'Main.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function Main.main 1
    push constant 8001
    push constant 16
    push constant 1
    not
    call Main.fillMemory 3
    pop temp 0
    push constant 8000
    call Memory.peek 1
    pop local 0
    push local 0
    call Main.convert 1
    pop temp 0
    push constant 0
    return
    function Main.convert 3
    push constant 0
    not
    pop local 2
    label WHILE_1
    push local 2
    not
    if-goto EXIT_WHILE_2
    push local 1
    push constant 1
    add
    pop local 1
    push local 0
    call Main.nextMask 1
    pop local 0
    push local 1
    push constant 16
    gt
    not
    not
    if-goto ELSE_3
    push argument 0
    push local 0
    and
    push constant 0
    eq
    not
    not
    if-goto ELSE_5
    push constant 8000
    push local 1
    add
    push constant 1
    call Memory.poke 2
    pop temp 0
    goto EXIT_IF_6
    label ELSE_5
    push constant 8000
    push local 1
    add
    push constant 0
    call Memory.poke 2
    pop temp 0
    label EXIT_IF_6
    goto EXIT_IF_4
    label ELSE_3
    push constant 0
    pop local 2
    label EXIT_IF_4
    goto WHILE_1
    label EXIT_WHILE_2
    push constant 0
    return
    function Main.nextMask 0
    push argument 0
    push constant 0
    eq
    not
    if-goto ELSE_7
    push constant 1
    return
    goto EXIT_IF_8
    label ELSE_7
    push argument 0
    push constant 2
    call Math.multiply 2
    return
    label EXIT_IF_8
    function Main.fillMemory 0
    label WHILE_9
    push argument 1
    push constant 0
    gt
    not
    if-goto EXIT_WHILE_10
    push argument 0
    push argument 2
    call Memory.poke 2
    pop temp 0
    push argument 1
    push constant 1
    sub
    pop argument 1
    push argument 0
    push constant 1
    add
    pop argument 0
    goto WHILE_9
    label EXIT_WHILE_10
    push constant 0
    return"
  `);
});
