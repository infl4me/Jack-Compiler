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

test('compile Square->SquareGame', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Square', 'SquareGame.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function SquareGame.new 0
    push constant 2
    call Memory.alloc 1
    pop pointer 0
    push constant 0
    push constant 0
    push constant 30
    call Square.new 3
    pop this 0
    push constant 0
    pop this 1
    push pointer 0
    return
    function SquareGame.dispose 0
    push argument 0
    pop pointer 0
    push this 0
    call square.dispose 1
    pop temp 0
    push pointer 0
    call Memory.deAlloc 1
    pop temp 0
    push constant 0
    return
    function SquareGame.moveSquare 0
    push argument 0
    pop pointer 0
    push this 1
    push constant 1
    eq
    not
    if-goto ELSE_11
    push this 0
    call square.moveUp 1
    pop temp 0
    goto EXIT_IF_12
    label ELSE_11
    label EXIT_IF_12
    push this 1
    push constant 2
    eq
    not
    if-goto ELSE_13
    push this 0
    call square.moveDown 1
    pop temp 0
    goto EXIT_IF_14
    label ELSE_13
    label EXIT_IF_14
    push this 1
    push constant 3
    eq
    not
    if-goto ELSE_15
    push this 0
    call square.moveLeft 1
    pop temp 0
    goto EXIT_IF_16
    label ELSE_15
    label EXIT_IF_16
    push this 1
    push constant 4
    eq
    not
    if-goto ELSE_17
    push this 0
    call square.moveRight 1
    pop temp 0
    goto EXIT_IF_18
    label ELSE_17
    label EXIT_IF_18
    push constant 5
    call Sys.wait 1
    pop temp 0
    push constant 0
    return
    function SquareGame.run 2
    push argument 0
    pop pointer 0
    push constant 0
    pop local 1
    label WHILE_19
    push local 1
    not
    not
    if-goto EXIT_WHILE_20
    label WHILE_21
    push local 0
    push constant 0
    eq
    not
    if-goto EXIT_WHILE_22
    call Keyboard.keyPressed 0
    pop local 0
    call moveSquare.undefined 0
    pop temp 0
    goto WHILE_21
    label EXIT_WHILE_22
    push local 0
    push constant 81
    eq
    not
    if-goto ELSE_23
    push constant 0
    not
    pop local 1
    goto EXIT_IF_24
    label ELSE_23
    label EXIT_IF_24
    push local 0
    push constant 90
    eq
    not
    if-goto ELSE_25
    push this 0
    call square.decSize 1
    pop temp 0
    goto EXIT_IF_26
    label ELSE_25
    label EXIT_IF_26
    push local 0
    push constant 88
    eq
    not
    if-goto ELSE_27
    push this 0
    call square.incSize 1
    pop temp 0
    goto EXIT_IF_28
    label ELSE_27
    label EXIT_IF_28
    push local 0
    push constant 131
    eq
    not
    if-goto ELSE_29
    push constant 1
    pop this 1
    goto EXIT_IF_30
    label ELSE_29
    label EXIT_IF_30
    push local 0
    push constant 133
    eq
    not
    if-goto ELSE_31
    push constant 2
    pop this 1
    goto EXIT_IF_32
    label ELSE_31
    label EXIT_IF_32
    push local 0
    push constant 130
    eq
    not
    if-goto ELSE_33
    push constant 3
    pop this 1
    goto EXIT_IF_34
    label ELSE_33
    label EXIT_IF_34
    push local 0
    push constant 132
    eq
    not
    if-goto ELSE_35
    push constant 4
    pop this 1
    goto EXIT_IF_36
    label ELSE_35
    label EXIT_IF_36
    label WHILE_37
    push local 0
    push constant 0
    eq
    not
    not
    if-goto EXIT_WHILE_38
    call Keyboard.keyPressed 0
    pop local 0
    call moveSquare.undefined 0
    pop temp 0
    goto WHILE_37
    label EXIT_WHILE_38
    goto WHILE_19
    label EXIT_WHILE_20
    push constant 0
    return"
  `);
});
