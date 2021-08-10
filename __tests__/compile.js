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
    neg
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
    call Square.dispose 1
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
    call Square.moveUp 1
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
    call Square.moveDown 1
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
    call Square.moveLeft 1
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
    call Square.moveRight 1
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
    push pointer 0
    call SquareGame.moveSquare 1
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
    call Square.decSize 1
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
    call Square.incSize 1
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
    push pointer 0
    call SquareGame.moveSquare 1
    pop temp 0
    goto WHILE_37
    label EXIT_WHILE_38
    goto WHILE_19
    label EXIT_WHILE_20
    push constant 0
    return"
  `);
});

test('compile Square->Square', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Square', 'Square.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function Square.new 0
    push constant 3
    call Memory.alloc 1
    pop pointer 0
    push argument 0
    pop this 0
    push argument 1
    pop this 1
    push argument 2
    pop this 2
    push pointer 0
    call Square.draw 1
    pop temp 0
    push pointer 0
    return
    function Square.dispose 0
    push argument 0
    pop pointer 0
    push pointer 0
    call Memory.deAlloc 1
    pop temp 0
    push constant 0
    return
    function Square.draw 0
    push argument 0
    pop pointer 0
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 0
    push this 2
    add
    push this 1
    push this 2
    add
    call Screen.drawRectangle 4
    pop temp 0
    push constant 0
    return
    function Square.erase 0
    push argument 0
    pop pointer 0
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 0
    push this 2
    add
    push this 1
    push this 2
    add
    call Screen.drawRectangle 4
    pop temp 0
    push constant 0
    return
    function Square.incSize 0
    push argument 0
    pop pointer 0
    push this 1
    push this 2
    add
    push constant 254
    lt
    push this 0
    push this 2
    add
    push constant 510
    lt
    and
    not
    if-goto ELSE_39
    push pointer 0
    call Square.erase 1
    pop temp 0
    push this 2
    push constant 2
    add
    pop this 2
    push pointer 0
    call Square.draw 1
    pop temp 0
    goto EXIT_IF_40
    label ELSE_39
    label EXIT_IF_40
    push constant 0
    return
    function Square.decSize 0
    push argument 0
    pop pointer 0
    push this 2
    push constant 2
    gt
    not
    if-goto ELSE_41
    push pointer 0
    call Square.erase 1
    pop temp 0
    push this 2
    push constant 2
    sub
    pop this 2
    push pointer 0
    call Square.draw 1
    pop temp 0
    goto EXIT_IF_42
    label ELSE_41
    label EXIT_IF_42
    push constant 0
    return
    function Square.moveUp 0
    push argument 0
    pop pointer 0
    push this 1
    push constant 1
    gt
    not
    if-goto ELSE_43
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 2
    add
    push constant 1
    sub
    push this 0
    push this 2
    add
    push this 1
    push this 2
    add
    call Screen.drawRectangle 4
    pop temp 0
    push this 1
    push constant 2
    sub
    pop this 1
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 0
    push this 2
    add
    push this 1
    push constant 1
    add
    call Screen.drawRectangle 4
    pop temp 0
    goto EXIT_IF_44
    label ELSE_43
    label EXIT_IF_44
    push constant 0
    return
    function Square.moveDown 0
    push argument 0
    pop pointer 0
    push this 1
    push this 2
    add
    push constant 254
    lt
    not
    if-goto ELSE_45
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 0
    push this 2
    add
    push this 1
    push constant 1
    add
    call Screen.drawRectangle 4
    pop temp 0
    push this 1
    push constant 2
    add
    pop this 1
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 2
    add
    push constant 1
    sub
    push this 0
    push this 2
    add
    push this 1
    push this 2
    add
    call Screen.drawRectangle 4
    pop temp 0
    goto EXIT_IF_46
    label ELSE_45
    label EXIT_IF_46
    push constant 0
    return
    function Square.moveLeft 0
    push argument 0
    pop pointer 0
    push this 0
    push constant 1
    gt
    not
    if-goto ELSE_47
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 2
    add
    push constant 1
    sub
    push this 1
    push this 0
    push this 2
    add
    push this 1
    push this 2
    add
    call Screen.drawRectangle 4
    pop temp 0
    push this 0
    push constant 2
    sub
    pop this 0
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 0
    push constant 1
    add
    push this 1
    push this 2
    add
    call Screen.drawRectangle 4
    pop temp 0
    goto EXIT_IF_48
    label ELSE_47
    label EXIT_IF_48
    push constant 0
    return
    function Square.moveRight 0
    push argument 0
    pop pointer 0
    push this 0
    push this 2
    add
    push constant 510
    lt
    not
    if-goto ELSE_49
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 0
    push constant 1
    add
    push this 1
    push this 2
    add
    call Screen.drawRectangle 4
    pop temp 0
    push this 0
    push constant 2
    add
    pop this 0
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 2
    add
    push constant 1
    sub
    push this 1
    push this 0
    push this 2
    add
    push this 1
    push this 2
    add
    call Screen.drawRectangle 4
    pop temp 0
    goto EXIT_IF_50
    label ELSE_49
    label EXIT_IF_50
    push constant 0
    return"
  `);
});

test('compile Average', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Average', 'Main.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function Main.main 4
    push constant 18
    call String.new 1
    push constant 72
    call String.appendChar 2
    push constant 111
    call String.appendChar 2
    push constant 119
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 109
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 110
    call String.appendChar 2
    push constant 121
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 110
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 109
    call String.appendChar 2
    push constant 98
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 63
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    call Keyboard.readInt 1
    pop local 1
    push local 1
    call Array.new 1
    pop local 0
    push constant 0
    pop local 2
    label WHILE_51
    push local 2
    push local 1
    lt
    not
    if-goto EXIT_WHILE_52
    push local 0
    push local 2
    add
    push constant 16
    call String.new 1
    push constant 69
    call String.appendChar 2
    push constant 110
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 110
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 109
    call String.appendChar 2
    push constant 98
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    call Keyboard.readInt 1
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 3
    push local 0
    push local 2
    add
    pop pointer 1
    push that 0
    add
    pop local 3
    push local 2
    push constant 1
    add
    pop local 2
    goto WHILE_51
    label EXIT_WHILE_52
    push constant 15
    call String.new 1
    push constant 84
    call String.appendChar 2
    push constant 104
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 118
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 103
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 105
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    call Output.printString 1
    pop temp 0
    push local 3
    push local 1
    call Math.divide 2
    call Output.printInt 1
    pop temp 0
    push constant 0
    return"
  `);
});

test('compile ComplexArrays', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'ComplexArrays', 'Main.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function Main.main 3
    push constant 10
    call Array.new 1
    pop local 0
    push constant 5
    call Array.new 1
    pop local 1
    push constant 1
    call Array.new 1
    pop local 2
    push local 0
    push constant 3
    add
    push constant 2
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 0
    push constant 4
    add
    push constant 8
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 0
    push constant 5
    add
    push constant 4
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 1
    push local 0
    push constant 3
    add
    pop pointer 1
    push that 0
    add
    push local 0
    push constant 3
    add
    pop pointer 1
    push that 0
    push constant 3
    add
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 0
    push local 1
    push local 0
    push constant 3
    add
    pop pointer 1
    push that 0
    add
    pop pointer 1
    push that 0
    add
    push local 0
    push local 0
    push constant 5
    add
    pop pointer 1
    push that 0
    add
    pop pointer 1
    push that 0
    push local 1
    push constant 7
    push local 0
    push constant 3
    add
    pop pointer 1
    push that 0
    sub
    push constant 2
    call Main.double 1
    sub
    push constant 1
    add
    add
    pop pointer 1
    push that 0
    call Math.multiply 2
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 2
    push constant 0
    add
    push constant 0
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 2
    push constant 0
    add
    pop pointer 1
    push that 0
    pop local 2
    push constant 43
    call String.new 1
    push constant 84
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 49
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 120
    call String.appendChar 2
    push constant 112
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 100
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 53
    call String.appendChar 2
    push constant 59
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    call Output.printString 1
    pop temp 0
    push local 1
    push constant 2
    add
    pop pointer 1
    push that 0
    call Output.printInt 1
    pop temp 0
    call Output.println 0
    pop temp 0
    push constant 44
    call String.new 1
    push constant 84
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 50
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 120
    call String.appendChar 2
    push constant 112
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 100
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 52
    call String.appendChar 2
    push constant 48
    call String.appendChar 2
    push constant 59
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    call Output.printString 1
    pop temp 0
    push local 0
    push constant 5
    add
    pop pointer 1
    push that 0
    call Output.printInt 1
    pop temp 0
    call Output.println 0
    pop temp 0
    push constant 43
    call String.new 1
    push constant 84
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 51
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 120
    call String.appendChar 2
    push constant 112
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 100
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 48
    call String.appendChar 2
    push constant 59
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    call Output.printString 1
    pop temp 0
    push local 2
    call Output.printInt 1
    pop temp 0
    call Output.println 0
    pop temp 0
    push constant 0
    pop local 2
    push local 2
    push constant 0
    eq
    not
    if-goto ELSE_53
    push local 0
    push constant 10
    call Main.fill 2
    pop temp 0
    push local 0
    push constant 3
    add
    pop pointer 1
    push that 0
    pop local 2
    push local 2
    push constant 1
    add
    push constant 33
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 0
    push constant 7
    add
    pop pointer 1
    push that 0
    pop local 2
    push local 2
    push constant 1
    add
    push constant 77
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    push local 0
    push constant 3
    add
    pop pointer 1
    push that 0
    pop local 1
    push local 1
    push constant 1
    add
    push local 1
    push constant 1
    add
    pop pointer 1
    push that 0
    push local 2
    push constant 1
    add
    pop pointer 1
    push that 0
    add
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    goto EXIT_IF_54
    label ELSE_53
    label EXIT_IF_54
    push constant 44
    call String.new 1
    push constant 84
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 52
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 120
    call String.appendChar 2
    push constant 112
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 100
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 55
    call String.appendChar 2
    push constant 55
    call String.appendChar 2
    push constant 59
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    call Output.printString 1
    pop temp 0
    push local 2
    push constant 1
    add
    pop pointer 1
    push that 0
    call Output.printInt 1
    pop temp 0
    call Output.println 0
    pop temp 0
    push constant 45
    call String.new 1
    push constant 84
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 53
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 120
    call String.appendChar 2
    push constant 112
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 100
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 49
    call String.appendChar 2
    push constant 49
    call String.appendChar 2
    push constant 48
    call String.appendChar 2
    push constant 59
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 115
    call String.appendChar 2
    push constant 117
    call String.appendChar 2
    push constant 108
    call String.appendChar 2
    push constant 116
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    call Output.printString 1
    pop temp 0
    push local 1
    push constant 1
    add
    pop pointer 1
    push that 0
    call Output.printInt 1
    pop temp 0
    call Output.println 0
    pop temp 0
    push constant 0
    return
    function Main.double 0
    push argument 0
    push constant 2
    call Math.multiply 2
    return
    function Main.fill 0
    label WHILE_55
    push argument 1
    push constant 0
    gt
    not
    if-goto EXIT_WHILE_56
    push argument 1
    push constant 1
    sub
    pop argument 1
    push argument 0
    push argument 1
    add
    push constant 3
    call Array.new 1
    pop temp 0
    pop pointer 1
    push temp 0
    pop that 0
    goto WHILE_55
    label EXIT_WHILE_56
    push constant 0
    return"
  `);
});

test('compile Pong->Ball', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Pong', 'Ball.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function Ball.new 0
    push constant 15
    call Memory.alloc 1
    pop pointer 0
    push argument 0
    pop this 0
    push argument 1
    pop this 1
    push argument 2
    pop this 10
    push argument 3
    push constant 6
    sub
    pop this 11
    push argument 4
    pop this 12
    push argument 5
    push constant 6
    sub
    pop this 13
    push constant 0
    pop this 14
    push pointer 0
    call Ball.show 1
    pop temp 0
    push pointer 0
    return
    function Ball.dispose 0
    push argument 0
    pop pointer 0
    push pointer 0
    call Memory.deAlloc 1
    pop temp 0
    push constant 0
    return
    function Ball.show 0
    push argument 0
    pop pointer 0
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push pointer 0
    call Ball.draw 1
    pop temp 0
    push constant 0
    return
    function Ball.hide 0
    push argument 0
    pop pointer 0
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push pointer 0
    call Ball.draw 1
    pop temp 0
    push constant 0
    return
    function Ball.draw 0
    push argument 0
    pop pointer 0
    push this 0
    push this 1
    push this 0
    push constant 5
    add
    push this 1
    push constant 5
    add
    call Screen.drawRectangle 4
    pop temp 0
    push constant 0
    return
    function Ball.getLeft 0
    push argument 0
    pop pointer 0
    push this 0
    return
    function Ball.getRight 0
    push argument 0
    pop pointer 0
    push this 0
    push constant 5
    add
    return
    function Ball.setDestination 3
    push argument 0
    pop pointer 0
    push argument 1
    push this 0
    sub
    pop this 2
    push argument 2
    push this 1
    sub
    pop this 3
    push this 2
    call Math.abs 1
    pop local 0
    push this 3
    call Math.abs 1
    pop local 1
    push local 0
    push local 1
    lt
    pop this 7
    push this 7
    not
    if-goto ELSE_57
    push local 0
    pop local 2
    push local 1
    pop local 0
    push local 2
    pop local 1
    push this 1
    push argument 2
    lt
    pop this 8
    push this 0
    push argument 1
    lt
    pop this 9
    goto EXIT_IF_58
    label ELSE_57
    push this 0
    push argument 1
    lt
    pop this 8
    push this 1
    push argument 2
    lt
    pop this 9
    label EXIT_IF_58
    push constant 2
    push local 1
    call Math.multiply 2
    push local 0
    sub
    pop this 4
    push constant 2
    push local 1
    call Math.multiply 2
    pop this 5
    push constant 2
    push local 1
    push local 0
    sub
    call Math.multiply 2
    pop this 6
    push constant 0
    return
    function Ball.move 0
    push argument 0
    pop pointer 0
    push pointer 0
    call Ball.hide 1
    pop temp 0
    push this 4
    push constant 0
    lt
    not
    if-goto ELSE_59
    push this 4
    push this 5
    add
    pop this 4
    goto EXIT_IF_60
    label ELSE_59
    push this 4
    push this 6
    add
    pop this 4
    push this 9
    not
    if-goto ELSE_61
    push this 7
    not
    if-goto ELSE_63
    push this 0
    push constant 4
    add
    pop this 0
    goto EXIT_IF_64
    label ELSE_63
    push this 1
    push constant 4
    add
    pop this 1
    label EXIT_IF_64
    goto EXIT_IF_62
    label ELSE_61
    push this 7
    not
    if-goto ELSE_65
    push this 0
    push constant 4
    sub
    pop this 0
    goto EXIT_IF_66
    label ELSE_65
    push this 1
    push constant 4
    sub
    pop this 1
    label EXIT_IF_66
    label EXIT_IF_62
    label EXIT_IF_60
    push this 8
    not
    if-goto ELSE_67
    push this 7
    not
    if-goto ELSE_69
    push this 1
    push constant 4
    add
    pop this 1
    goto EXIT_IF_70
    label ELSE_69
    push this 0
    push constant 4
    add
    pop this 0
    label EXIT_IF_70
    goto EXIT_IF_68
    label ELSE_67
    push this 7
    not
    if-goto ELSE_71
    push this 1
    push constant 4
    sub
    pop this 1
    goto EXIT_IF_72
    label ELSE_71
    push this 0
    push constant 4
    sub
    pop this 0
    label EXIT_IF_72
    label EXIT_IF_68
    push this 0
    push this 10
    gt
    not
    not
    if-goto ELSE_73
    push constant 1
    pop this 14
    push this 10
    pop this 0
    goto EXIT_IF_74
    label ELSE_73
    label EXIT_IF_74
    push this 0
    push this 11
    lt
    not
    not
    if-goto ELSE_75
    push constant 2
    pop this 14
    push this 11
    pop this 0
    goto EXIT_IF_76
    label ELSE_75
    label EXIT_IF_76
    push this 1
    push this 12
    gt
    not
    not
    if-goto ELSE_77
    push constant 3
    pop this 14
    push this 12
    pop this 1
    goto EXIT_IF_78
    label ELSE_77
    label EXIT_IF_78
    push this 1
    push this 13
    lt
    not
    not
    if-goto ELSE_79
    push constant 4
    pop this 14
    push this 13
    pop this 1
    goto EXIT_IF_80
    label ELSE_79
    label EXIT_IF_80
    push pointer 0
    call Ball.show 1
    pop temp 0
    push this 14
    return
    function Ball.bounce 5
    push argument 0
    pop pointer 0
    push this 2
    push constant 10
    call Math.divide 2
    pop local 2
    push this 3
    push constant 10
    call Math.divide 2
    pop local 3
    push argument 1
    push constant 0
    eq
    not
    if-goto ELSE_81
    push constant 10
    pop local 4
    goto EXIT_IF_82
    label ELSE_81
    push this 2
    push constant 0
    lt
    not
    push argument 1
    push constant 1
    eq
    and
    push this 2
    push constant 0
    lt
    push argument 1
    push constant 1
    neg
    eq
    and
    or
    not
    if-goto ELSE_83
    push constant 20
    pop local 4
    goto EXIT_IF_84
    label ELSE_83
    push constant 5
    pop local 4
    label EXIT_IF_84
    label EXIT_IF_82
    push this 14
    push constant 1
    eq
    not
    if-goto ELSE_85
    push constant 506
    pop local 0
    push local 3
    push constant 50
    neg
    call Math.multiply 2
    push local 2
    call Math.divide 2
    pop local 1
    push this 1
    push local 1
    push local 4
    call Math.multiply 2
    add
    pop local 1
    goto EXIT_IF_86
    label ELSE_85
    push this 14
    push constant 2
    eq
    not
    if-goto ELSE_87
    push constant 0
    pop local 0
    push local 3
    push constant 50
    call Math.multiply 2
    push local 2
    call Math.divide 2
    pop local 1
    push this 1
    push local 1
    push local 4
    call Math.multiply 2
    add
    pop local 1
    goto EXIT_IF_88
    label ELSE_87
    push this 14
    push constant 3
    eq
    not
    if-goto ELSE_89
    push constant 250
    pop local 1
    push local 2
    push constant 25
    neg
    call Math.multiply 2
    push local 3
    call Math.divide 2
    pop local 0
    push this 0
    push local 0
    push local 4
    call Math.multiply 2
    add
    pop local 0
    goto EXIT_IF_90
    label ELSE_89
    push constant 0
    pop local 1
    push local 2
    push constant 25
    call Math.multiply 2
    push local 3
    call Math.divide 2
    pop local 0
    push this 0
    push local 0
    push local 4
    call Math.multiply 2
    add
    pop local 0
    label EXIT_IF_90
    label EXIT_IF_88
    label EXIT_IF_86
    push pointer 0
    push local 0
    push local 1
    call Ball.setDestination 3
    pop temp 0
    push constant 0
    return"
  `);
});

test('compile Pong->Main', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Pong', 'Main.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function Main.main 1
    call PongGame.newInstance 0
    pop temp 0
    call PongGame.getInstance 0
    pop local 0
    push local 0
    call PongGame.run 1
    pop temp 0
    push local 0
    call PongGame.dispose 1
    pop temp 0
    push constant 0
    return"
  `);
});

test('compile Pong->Bat', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Pong', 'Bat.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function Bat.new 0
    push constant 5
    call Memory.alloc 1
    pop pointer 0
    push argument 0
    pop this 0
    push argument 1
    pop this 1
    push argument 2
    pop this 2
    push argument 3
    pop this 3
    push constant 2
    pop this 4
    push pointer 0
    call Bat.show 1
    pop temp 0
    push pointer 0
    return
    function Bat.dispose 0
    push argument 0
    pop pointer 0
    push pointer 0
    call Memory.deAlloc 1
    pop temp 0
    push constant 0
    return
    function Bat.show 0
    push argument 0
    pop pointer 0
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push pointer 0
    call Bat.draw 1
    pop temp 0
    push constant 0
    return
    function Bat.hide 0
    push argument 0
    pop pointer 0
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push pointer 0
    call Bat.draw 1
    pop temp 0
    push constant 0
    return
    function Bat.draw 0
    push argument 0
    pop pointer 0
    push this 0
    push this 1
    push this 0
    push this 2
    add
    push this 1
    push this 3
    add
    call Screen.drawRectangle 4
    pop temp 0
    push constant 0
    return
    function Bat.setDirection 0
    push argument 0
    pop pointer 0
    push argument 1
    pop this 4
    push constant 0
    return
    function Bat.getLeft 0
    push argument 0
    pop pointer 0
    push this 0
    return
    function Bat.getRight 0
    push argument 0
    pop pointer 0
    push this 0
    push this 2
    add
    return
    function Bat.setWidth 0
    push argument 0
    pop pointer 0
    push pointer 0
    call Bat.hide 1
    pop temp 0
    push argument 1
    pop this 2
    push pointer 0
    call Bat.show 1
    pop temp 0
    push constant 0
    return
    function Bat.move 0
    push argument 0
    pop pointer 0
    push this 4
    push constant 1
    eq
    not
    if-goto ELSE_91
    push this 0
    push constant 4
    sub
    pop this 0
    push this 0
    push constant 0
    lt
    not
    if-goto ELSE_93
    push constant 0
    pop this 0
    goto EXIT_IF_94
    label ELSE_93
    label EXIT_IF_94
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 2
    add
    push constant 1
    add
    push this 1
    push this 0
    push this 2
    add
    push constant 4
    add
    push this 1
    push this 3
    add
    call Screen.drawRectangle 4
    pop temp 0
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 1
    push this 0
    push constant 3
    add
    push this 1
    push this 3
    add
    call Screen.drawRectangle 4
    pop temp 0
    goto EXIT_IF_92
    label ELSE_91
    push this 0
    push constant 4
    add
    pop this 0
    push this 0
    push this 2
    add
    push constant 511
    gt
    not
    if-goto ELSE_95
    push constant 511
    push this 2
    sub
    pop this 0
    goto EXIT_IF_96
    label ELSE_95
    label EXIT_IF_96
    push constant 0
    call Screen.setColor 1
    pop temp 0
    push this 0
    push constant 4
    sub
    push this 1
    push this 0
    push constant 1
    sub
    push this 1
    push this 3
    add
    call Screen.drawRectangle 4
    pop temp 0
    push constant 0
    not
    call Screen.setColor 1
    pop temp 0
    push this 0
    push this 2
    add
    push constant 3
    sub
    push this 1
    push this 0
    push this 2
    add
    push this 1
    push this 3
    add
    call Screen.drawRectangle 4
    pop temp 0
    label EXIT_IF_92
    push constant 0
    return"
  `);
});

test('compile Pong->PongGame', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Pong', 'PongGame.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function PongGame.new 0
    push constant 7
    call Memory.alloc 1
    pop pointer 0
    call Screen.clearScreen 0
    pop temp 0
    push constant 50
    pop this 6
    push constant 230
    push constant 229
    push this 6
    push constant 7
    call Bat.new 4
    pop this 0
    push constant 253
    push constant 222
    push constant 0
    push constant 511
    push constant 0
    push constant 229
    call Ball.new 6
    pop this 1
    push this 1
    push constant 400
    push constant 0
    call Ball.setDestination 3
    pop temp 0
    push constant 0
    push constant 238
    push constant 511
    push constant 240
    call Screen.drawRectangle 4
    pop temp 0
    push constant 22
    push constant 0
    call Output.moveCursor 2
    pop temp 0
    push constant 8
    call String.new 1
    push constant 83
    call String.appendChar 2
    push constant 99
    call String.appendChar 2
    push constant 111
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 58
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 48
    call String.appendChar 2
    call Output.printString 1
    pop temp 0
    push constant 0
    pop this 3
    push constant 0
    pop this 4
    push constant 0
    pop this 2
    push constant 0
    pop this 5
    push pointer 0
    return
    function PongGame.dispose 0
    push argument 0
    pop pointer 0
    push this 0
    call Bat.dispose 1
    pop temp 0
    push this 1
    call Ball.dispose 1
    pop temp 0
    push pointer 0
    call Memory.deAlloc 1
    pop temp 0
    push constant 0
    return
    function PongGame.newInstance 0
    call PongGame.new 0
    pop static 0
    push constant 0
    return
    function PongGame.getInstance 0
    push static 0
    return
    function PongGame.run 1
    push argument 0
    pop pointer 0
    label WHILE_97
    push this 3
    not
    not
    if-goto EXIT_WHILE_98
    label WHILE_99
    push local 0
    push constant 0
    eq
    push this 3
    not
    and
    not
    if-goto EXIT_WHILE_100
    call Keyboard.keyPressed 0
    pop local 0
    push this 0
    call Bat.move 1
    pop temp 0
    push pointer 0
    call PongGame.moveBall 1
    pop temp 0
    push constant 50
    call Sys.wait 1
    pop temp 0
    goto WHILE_99
    label EXIT_WHILE_100
    push local 0
    push constant 130
    eq
    not
    if-goto ELSE_101
    push this 0
    push constant 1
    call Bat.setDirection 2
    pop temp 0
    goto EXIT_IF_102
    label ELSE_101
    push local 0
    push constant 132
    eq
    not
    if-goto ELSE_103
    push this 0
    push constant 2
    call Bat.setDirection 2
    pop temp 0
    goto EXIT_IF_104
    label ELSE_103
    push local 0
    push constant 140
    eq
    not
    if-goto ELSE_105
    push constant 0
    not
    pop this 3
    goto EXIT_IF_106
    label ELSE_105
    label EXIT_IF_106
    label EXIT_IF_104
    label EXIT_IF_102
    label WHILE_107
    push local 0
    push constant 0
    eq
    not
    push this 3
    not
    and
    not
    if-goto EXIT_WHILE_108
    call Keyboard.keyPressed 0
    pop local 0
    push this 0
    call Bat.move 1
    pop temp 0
    push pointer 0
    call PongGame.moveBall 1
    pop temp 0
    push constant 50
    call Sys.wait 1
    pop temp 0
    goto WHILE_107
    label EXIT_WHILE_108
    goto WHILE_97
    label EXIT_WHILE_98
    push this 3
    not
    if-goto ELSE_109
    push constant 10
    push constant 27
    call Output.moveCursor 2
    pop temp 0
    push constant 9
    call String.new 1
    push constant 71
    call String.appendChar 2
    push constant 97
    call String.appendChar 2
    push constant 109
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 32
    call String.appendChar 2
    push constant 79
    call String.appendChar 2
    push constant 118
    call String.appendChar 2
    push constant 101
    call String.appendChar 2
    push constant 114
    call String.appendChar 2
    call Output.printString 1
    pop temp 0
    goto EXIT_IF_110
    label ELSE_109
    label EXIT_IF_110
    push constant 0
    return
    function PongGame.moveBall 5
    push argument 0
    pop pointer 0
    push this 1
    call Ball.move 1
    pop this 2
    push this 2
    push constant 0
    gt
    push this 2
    push this 5
    eq
    not
    and
    not
    if-goto ELSE_111
    push this 2
    pop this 5
    push constant 0
    pop local 0
    push this 0
    call Bat.getLeft 1
    pop local 1
    push this 0
    call Bat.getRight 1
    pop local 2
    push this 1
    call Ball.getLeft 1
    pop local 3
    push this 1
    call Ball.getRight 1
    pop local 4
    push this 2
    push constant 4
    eq
    not
    if-goto ELSE_113
    push local 1
    push local 4
    gt
    push local 2
    push local 3
    lt
    or
    pop this 3
    push this 3
    not
    not
    if-goto ELSE_115
    push local 4
    push local 1
    push constant 10
    add
    lt
    not
    if-goto ELSE_117
    push constant 1
    neg
    pop local 0
    goto EXIT_IF_118
    label ELSE_117
    push local 3
    push local 2
    push constant 10
    sub
    gt
    not
    if-goto ELSE_119
    push constant 1
    pop local 0
    goto EXIT_IF_120
    label ELSE_119
    label EXIT_IF_120
    label EXIT_IF_118
    push this 6
    push constant 2
    sub
    pop this 6
    push this 0
    push this 6
    call Bat.setWidth 2
    pop temp 0
    push this 4
    push constant 1
    add
    pop this 4
    push constant 22
    push constant 7
    call Output.moveCursor 2
    pop temp 0
    push this 4
    call Output.printInt 1
    pop temp 0
    goto EXIT_IF_116
    label ELSE_115
    label EXIT_IF_116
    goto EXIT_IF_114
    label ELSE_113
    label EXIT_IF_114
    push this 1
    push local 0
    call Ball.bounce 2
    pop temp 0
    goto EXIT_IF_112
    label ELSE_111
    label EXIT_IF_112
    push constant 0
    return"
  `);
});
