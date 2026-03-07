export type CsharpCodeExample = {
  snippet: string;
  output?: string;
  language?: "csharp" | "text";
};

export type CsharpFixExercise = {
  title: string;
  broken: string;
  solution: string;
  hint: string;
  /** When provided, uses custom validation instead of exact match. E.g. "var-int-assignment" accepts any int. */
  validationMode?: string;
};

export type CsharpQuiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type CsharpSection = {
  heading: string;
  text: string;
  code?: CsharpCodeExample;
  fixExercise?: CsharpFixExercise;
  quiz?: CsharpQuiz;
};

export type CsharpTopic = {
  slug: string;
  title: string;
  subtitle: string;
  source: string;
  available: boolean;
  sections: CsharpSection[];
};

export const csharpTopics: CsharpTopic[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // INTRODUCTION
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "intro",
    title: "Introduction to C#",
    subtitle:
      "Syntax, variables, data types, type casting, user input, operators, strings, control flow, loops, arrays, and methods.",
    source: "1.Intro_To_CSharp.pdf",
    available: true,
    sections: [
      // ── SYNTAX ──────────────────────────────────────────────────────────
      {
        heading: "Program Structure and Syntax",
        text: "Every C# program starts from Main(). Code lives inside classes, statements end with semicolons, and C# is case-sensitive — Console.WriteLine is not the same as console.writeline.",
        code: {
          language: "csharp",
          snippet: `using System;

namespace HelloWorld
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine("Hello, World!");
        }
    }
}`,
          output: "Hello, World!",
        },
      },
      {
        heading: "Syntax — Exercise 1",
        text: "Fix the broken starter program, then answer the concept question.",
        fixExercise: {
          title: "Fix all syntax errors in the program",
          broken: `using System;

class Program
{
    static void Main()
    {
        console.writeline("Hello")
        Console.writeLine("World")
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello");
        Console.WriteLine("World");
    }
}`,
          hint: "C# is case-sensitive. Check the capitalization of Console and WriteLine, and add a semicolon after each statement.",
        },
        quiz: {
          question: "What character ends every statement in C#?",
          options: [
            "A period (.)",
            "A colon (:)",
            "A semicolon (;)",
            "A newline",
          ],
          answer: 2,
          explanation:
            "Every statement in C# must be terminated with a semicolon (;).",
        },
      },
      {
        heading: "Syntax — Exercise 2",
        text: "Single-line comments use //. Multi-line comments use /* */. Neither affects execution.",
        fixExercise: {
          title: "Uncomment the correct line and fix the second statement",
          broken: `using System;

class Program
{
    static void Main()
    {
        // Console.WriteLine("First line");
        Console.Writeline("Second line")
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("First line");
        Console.WriteLine("Second line");
    }
}`,
          hint: "Remove the // before the first WriteLine. Fix the capitalisation of the second one and add a semicolon.",
        },
      },

      // ── VARIABLES ────────────────────────────────────────────────────────
      {
        heading: "Variables and Constants",
        text: "Variables store values that can change. Use const for compile-time constants that never change. var lets the compiler infer the type from the assigned value.",
        code: {
          language: "csharp",
          snippet: `int age = 25;
string name = "Alice";
const double Pi = 3.14159;
var score = 100;          // inferred as int

Console.WriteLine(name + " is " + age);
Console.WriteLine("Pi = " + Pi);
Console.WriteLine("Score: " + score);`,
          output: `Alice is 25
Pi = 3.14159
Score: 100`,
        },
      },
      {
        heading: "Variables — Exercise 1",
        text: "const values are fixed at compile time and cannot be reassigned. Trying to do so causes a compile error.",
        fixExercise: {
          title: "Fix the illegal const reassignment",
          broken: `using System;

class Program
{
    static void Main()
    {
        const int max = 10;
        max = 20;
        Console.WriteLine(max);
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        int max = 10;
        max = 20;
        Console.WriteLine(max);
    }
}`,
          hint: "Remove const to make max a regular variable that can be reassigned.",
        },
        quiz: {
          question:
            "Which keyword creates a value that cannot be changed after declaration?",
          options: ["static", "readonly", "const", "fixed"],
          answer: 2,
          explanation:
            "const creates a compile-time constant. readonly is set once at construction time.",
        },
      },
      {
        heading: "Variables — Exercise 2",
        text: "Once var infers a type, that type is locked. You cannot assign a value of a different type to the same variable.",
        fixExercise: {
          title: "Fix the var type mismatch",
          broken: `using System;

class Program
{
    static void Main()
    {
        var number = 10;
        number = "twenty";
        Console.WriteLine(number);
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        var number = 10;
        number = 20;
        Console.WriteLine(number);
    }
}`,
          hint: "var infers int from the literal 10. You cannot later assign a string to it.",
          validationMode: "var-int-assignment",
        },
      },

      // ── DATA TYPES ───────────────────────────────────────────────────────
      {
        heading: "Data Types",
        text: "C# has value types (int, double, bool, char) and reference types (string, arrays, objects). Value types hold data directly; reference types hold a memory address.",
        code: {
          language: "csharp",
          snippet: `int count = 5;
double price = 9.99;
bool isActive = true;
char grade = 'A';
string message = "Hello";

Console.WriteLine($"{count}, {price}, {isActive}, {grade}, {message}");`,
          output: "5, 9.99, True, A, Hello",
        },
      },
      {
        heading: "Data Types — Exercise 1",
        text: "char uses single quotes for a single character. string uses double quotes for text. Mixing them is a compile error.",
        fixExercise: {
          title: "Fix the mismatched quote styles",
          broken: `using System;

class Program
{
    static void Main()
    {
        char initial = "A";
        string greeting = 'Hi';
        Console.WriteLine(initial);
        Console.WriteLine(greeting);
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        char initial = 'A';
        string greeting = "Hi";
        Console.WriteLine(initial);
        Console.WriteLine(greeting);
    }
}`,
          hint: "char uses single quotes ('A'). string uses double quotes (\"Hi\").",
        },
        quiz: {
          question:
            "What is the default value of an uninitialized int field in C#?",
          options: ["null", "1", "0", "-1"],
          answer: 2,
          explanation:
            "Numeric value types default to 0. bool defaults to false. Reference types default to null.",
        },
      },

      // ── TYPE CASTING ─────────────────────────────────────────────────────
      {
        heading: "Type Casting",
        text: "Implicit casting converts to a larger compatible type automatically (int → double). Explicit casting uses a cast operator (int) and may lose precision.",
        code: {
          language: "csharp",
          snippet: `int myInt = 9;
double myDouble = myInt;        // implicit: no data loss

double price = 19.75;
int rounded = (int)price;       // explicit: decimal is truncated

Console.WriteLine(myDouble);
Console.WriteLine(rounded);`,
          output: `9
19`,
        },
      },
      {
        heading: "Type Casting — Exercise 1",
        text: "You cannot cast a string directly to a numeric type with (). Use int.Parse() or Convert.ToInt32() instead.",
        fixExercise: {
          title: "Fix the invalid string-to-int cast",
          broken: `using System;

class Program
{
    static void Main()
    {
        string input = "42";
        int number = (int)input;
        Console.WriteLine(number);
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        string input = "42";
        int number = int.Parse(input);
        Console.WriteLine(number);
    }
}`,
          hint: "Use int.Parse() or Convert.ToInt32() to convert a string to an integer.",
        },
        quiz: {
          question:
            "Which conversion requires an explicit cast operator in C#?",
          options: [
            "int to double",
            "double to int",
            "int to long",
            "int to float",
          ],
          answer: 1,
          explanation:
            "Converting double to int loses the fractional part and requires an explicit (int) cast.",
        },
      },

      // ── USER INPUT ───────────────────────────────────────────────────────
      {
        heading: "User Input",
        text: "Console.ReadLine() reads a line of text and always returns a string. Convert it to a number with int.Parse() or Convert.ToInt32() before arithmetic.",
        code: {
          language: "csharp",
          snippet: `Console.Write("Enter your name: ");
string name = Console.ReadLine();

Console.Write("Enter your age: ");
int age = int.Parse(Console.ReadLine());

Console.WriteLine($"Hello {name}, you are {age} years old.");`,
          output: `Enter your name: Alice
Enter your age: 30
Hello Alice, you are 30 years old.`,
        },
      },
      {
        heading: "User Input — Exercise 1",
        text: "Console.ReadLine() returns string, not int. You must parse it before using it in arithmetic.",
        fixExercise: {
          title: "Fix the missing parse call",
          broken: `using System;

class Program
{
    static void Main()
    {
        Console.Write("Enter a number: ");
        int num = Console.ReadLine();
        Console.WriteLine(num * 2);
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("Enter a number: ");
        int num = int.Parse(Console.ReadLine());
        Console.WriteLine(num * 2);
    }
}`,
          hint: "Console.ReadLine() returns a string. Wrap it with int.Parse() to convert to int.",
        },
        quiz: {
          question: "What type does Console.ReadLine() return?",
          options: ["int", "char", "string", "double"],
          answer: 2,
          explanation:
            "Console.ReadLine() always returns string, regardless of what the user types.",
        },
      },

      // ── OPERATORS ────────────────────────────────────────────────────────
      {
        heading: "Operators",
        text: "C# supports arithmetic (+, -, *, /, %), comparison (==, !=, <, >), logical (&&, ||, !), and compound assignment (+=, -=, *=) operators.",
        code: {
          language: "csharp",
          snippet: `int a = 10, b = 3;

Console.WriteLine(a + b);           // 13
Console.WriteLine(a / b);           // 3  (integer division)
Console.WriteLine(a % b);           // 1  (remainder)
Console.WriteLine(a > b);           // True
Console.WriteLine(a == 10 && b < 5); // True`,
          output: `13
3
1
True
True`,
        },
      },
      {
        heading: "Operators — Exercise 1",
        text: "When both operands are int, / performs integer division and drops the decimal. Cast one to double for a decimal result.",
        fixExercise: {
          title: "Fix integer division to produce 3.5",
          broken: `using System;

class Program
{
    static void Main()
    {
        int a = 7;
        int b = 2;
        double result = a / b;
        Console.WriteLine(result);  // expected 3.5
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        double a = 7;
        double b = 2;
        double result = a / b;
        Console.WriteLine(result);  // 3.5
    }
}`,
          hint: "Change a and b to double so the division produces a decimal result.",
        },
        quiz: {
          question: "What does the % operator return?",
          options: [
            "The quotient of division",
            "The remainder after division",
            "The percentage value",
            "The absolute value",
          ],
          answer: 1,
          explanation:
            "% is the modulo operator. 10 % 3 returns 1 because 10 = 3 × 3 + 1.",
        },
      },

      // ── STRINGS ──────────────────────────────────────────────────────────
      {
        heading: "Strings",
        text: 'Strings are immutable sequences of characters. Use string interpolation ($"") or concatenation (+) to combine them. Common members: Length, ToUpper(), ToLower(), Substring(), Contains(), Replace().',
        code: {
          language: "csharp",
          snippet: `string name = "Alice";
string greeting = $"Hello, {name}!";

Console.WriteLine(greeting);
Console.WriteLine(name.Length);
Console.WriteLine(name.ToUpper());
Console.WriteLine(name.Contains("li"));
Console.WriteLine(name.Replace("Alice", "Bob"));`,
          output: `Hello, Alice!
5
ALICE
True
Bob`,
        },
      },
      {
        heading: "Strings — Exercise 1",
        text: "String interpolation requires a $ before the opening quote. Without it, the curly braces are printed as literal text.",
        fixExercise: {
          title: "Fix the missing $ for interpolation",
          broken: `using System;

class Program
{
    static void Main()
    {
        string city = "Paris";
        int year = 2024;
        Console.WriteLine("Welcome to {city} in {year}!");
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        string city = "Paris";
        int year = 2024;
        Console.WriteLine($"Welcome to {city} in {year}!");
    }
}`,
          hint: "Add $ before the opening quote to enable interpolation.",
        },
        quiz: {
          question:
            "Which member returns the number of characters in a string?",
          options: ["Count()", "Size()", "Length", "Len()"],
          answer: 2,
          explanation:
            "Length is a property (not a method) that returns the character count of a string.",
        },
      },

      // ── CONTROL FLOW ─────────────────────────────────────────────────────
      {
        heading: "Control Flow — if/else and switch",
        text: "if/else branches on conditions. switch compares one value against multiple cases. In C#, each case must end with break — implicit fall-through is not allowed.",
        code: {
          language: "csharp",
          snippet: `int score = 75;

if (score >= 90)
    Console.WriteLine("A");
else if (score >= 70)
    Console.WriteLine("B");
else
    Console.WriteLine("C");

string day = "Mon";
switch (day)
{
    case "Mon": Console.WriteLine("Monday"); break;
    case "Fri": Console.WriteLine("Friday"); break;
    default:    Console.WriteLine("Other");  break;
}`,
          output: `B
Monday`,
        },
      },
      {
        heading: "Control Flow — Exercise 1",
        text: "Each case in a C# switch must end with break, return, or goto. Omitting break is a compile error.",
        fixExercise: {
          title: "Fix the missing break statements in switch",
          broken: `using System;

class Program
{
    static void Main()
    {
        int x = 2;
        switch (x)
        {
            case 1: Console.WriteLine("One");
            case 2: Console.WriteLine("Two");
            case 3: Console.WriteLine("Three");
        }
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        int x = 2;
        switch (x)
        {
            case 1: Console.WriteLine("One");   break;
            case 2: Console.WriteLine("Two");   break;
            case 3: Console.WriteLine("Three"); break;
        }
    }
}`,
          hint: "Add break; after each case body.",
        },
        quiz: {
          question: "Which keyword exits a switch case in C#?",
          options: ["exit", "stop", "break", "end"],
          answer: 2,
          explanation:
            "break exits the current switch case. C# does not allow implicit fall-through.",
        },
      },
      {
        heading: "Control Flow — Exercise 2",
        text: "The ternary operator (condition ? trueValue : falseValue) is a concise alternative to if/else for simple assignments.",
        fixExercise: {
          title: "Fix the broken ternary expression",
          broken: `using System;

class Program
{
    static void Main()
    {
        int age = 20;
        string status = age >= 18 ? "Adult";
        Console.WriteLine(status);
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        int age = 20;
        string status = age >= 18 ? "Adult" : "Minor";
        Console.WriteLine(status);
    }
}`,
          hint: "The ternary operator always needs both a true-value and a false-value separated by :",
        },
      },

      // ── LOOPS ────────────────────────────────────────────────────────────
      {
        heading: "Loops — for, while, foreach",
        text: "for loops are best when the count is known. while loops run while a condition holds. foreach iterates over every element of a collection without an index.",
        code: {
          language: "csharp",
          snippet: `for (int i = 0; i < 3; i++)
    Console.WriteLine("for: " + i);

int n = 3;
while (n > 0)
{
    Console.WriteLine("while: " + n);
    n--;
}

int[] nums = { 10, 20, 30 };
foreach (int num in nums)
    Console.WriteLine("foreach: " + num);`,
          output: `for: 0
for: 1
for: 2
while: 3
while: 2
while: 1
foreach: 10
foreach: 20
foreach: 30`,
        },
      },
      {
        heading: "Loops — Exercise 1",
        text: "An off-by-one error makes a loop start or stop one step too early or too late.",
        fixExercise: {
          title: "Fix the loop to print 1 through 5",
          broken: `using System;

class Program
{
    static void Main()
    {
        // Should print 1, 2, 3, 4, 5
        for (int i = 0; i <= 5; i++)
            Console.WriteLine(i);
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        // Should print 1, 2, 3, 4, 5
        for (int i = 1; i <= 5; i++)
            Console.WriteLine(i);
    }
}`,
          hint: "Starting at i = 0 would print 0 as well. Start at i = 1.",
        },
        quiz: {
          question: "What does break do inside a loop?",
          options: [
            "Skips the current iteration and continues the next",
            "Restarts the loop from the beginning",
            "Exits the loop immediately",
            "Pauses execution for one second",
          ],
          answer: 2,
          explanation:
            "break exits the nearest enclosing loop immediately. Use continue to skip one iteration.",
        },
      },
      {
        heading: "Loops — Exercise 2",
        text: "continue skips the rest of the current iteration and moves to the next one. It is useful to filter values inside a loop.",
        fixExercise: {
          title: "Print only even numbers (2, 4, 6, 8, 10) using continue",
          broken: `using System;

class Program
{
    static void Main()
    {
        for (int i = 1; i <= 10; i++)
        {
            if (i % 2 == 1) break;
            Console.WriteLine(i);
        }
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        for (int i = 1; i <= 10; i++)
        {
            if (i % 2 == 1) continue;
            Console.WriteLine(i);
        }
    }
}`,
          hint: "Replace break with continue to skip odd numbers instead of stopping the loop.",
        },
      },

      // ── ARRAYS ───────────────────────────────────────────────────────────
      {
        heading: "Arrays",
        text: "Arrays hold a fixed number of elements of the same type. Declare with Type[], initialize inline with {} or with new Type[size]. Access elements via zero-based index.",
        code: {
          language: "csharp",
          snippet: `int[] scores = { 85, 90, 78, 92 };
string[] names = new string[3];
names[0] = "Alice";
names[1] = "Bob";
names[2] = "Carol";

Console.WriteLine(scores[0]);
Console.WriteLine(scores.Length);

foreach (string n in names)
    Console.WriteLine(n);`,
          output: `85
4
Alice
Bob
Carol`,
        },
      },
      {
        heading: "Arrays — Exercise 1",
        text: "Array indices are zero-based. The last valid index is Length - 1. Accessing Length causes IndexOutOfRangeException.",
        fixExercise: {
          title: "Fix the index out-of-range error",
          broken: `using System;

class Program
{
    static void Main()
    {
        int[] data = { 10, 20, 30 };
        Console.WriteLine(data[3]);
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        int[] data = { 10, 20, 30 };
        Console.WriteLine(data[2]);
    }
}`,
          hint: "The array has 3 elements: valid indices are 0, 1, and 2. Index 3 does not exist.",
        },
        quiz: {
          question: "What property gives the number of elements in a C# array?",
          options: ["Count", "Size", "Length", "Capacity"],
          answer: 2,
          explanation:
            "Arrays expose a Length property. List<T> uses Count. Both give the element count.",
        },
      },

      // ── METHODS ──────────────────────────────────────────────────────────
      {
        heading: "Methods",
        text: "A method groups reusable code under a name. It has a return type (or void), a name, parameters in (), and a body in {}. Call it by name with matching arguments.",
        code: {
          language: "csharp",
          snippet: `static int Add(int a, int b)
{
    return a + b;
}

static void Greet(string name)
{
    Console.WriteLine("Hello, " + name + "!");
}

Console.WriteLine(Add(3, 4));
Greet("Alice");`,
          output: `7
Hello, Alice!`,
        },
      },
      {
        heading: "Methods — Exercise 1",
        text: "A non-void method must always reach a return statement of the declared type. Omitting it causes a compile error.",
        fixExercise: {
          title: "Fix the missing return statement",
          broken: `using System;

class Program
{
    static int Square(int n)
    {
        int result = n * n;
    }

    static void Main()
    {
        Console.WriteLine(Square(5));
    }
}`,
          solution: `using System;

class Program
{
    static int Square(int n)
    {
        int result = n * n;
        return result;
    }

    static void Main()
    {
        Console.WriteLine(Square(5));
    }
}`,
          hint: "A method declared as int must end with return <int value>;",
        },
        quiz: {
          question:
            "What return type should a method use if it returns nothing?",
          options: ["null", "empty", "nothing", "void"],
          answer: 3,
          explanation:
            "void means the method performs an action but returns no value.",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CLASSES AND OBJECTS
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "classes-objects",
    title: "Classes and Objects",
    subtitle:
      "OOP concepts, members, constructors, destructors, and value/reference behavior.",
    source: "Ch1_OOP.pdf",
    available: true,
    sections: [
      // ── CLASS AND OBJECT ─────────────────────────────────────────────────
      {
        heading: "Defining a Class and Creating Objects",
        text: "A class is a blueprint for objects. An object is an instance created with new. The class defines the fields, properties, and methods every instance will have.",
        code: {
          language: "csharp",
          snippet: `public class Student
{
    public string Name = "";
    public int Age { get; set; }

    public void PrintInfo()
    {
        Console.WriteLine($"Name: {Name}, Age: {Age}");
    }
}

Student s = new Student();
s.Name = "Alice";
s.Age = 22;
s.PrintInfo();`,
          output: "Name: Alice, Age: 22",
        },
      },
      {
        heading: "Classes and Objects — Exercise 1",
        text: "Access class members through the object reference using the dot (.) operator.",
        fixExercise: {
          title: "Fix the incorrect member access",
          broken: `using System;

class Car
{
    public string Brand = "";
    public void Honk() => Console.WriteLine("Beep!");
}

class Program
{
    static void Main()
    {
        Car myCar;
        myCar.Brand = "Toyota";
        myCar.Honk();
    }
}`,
          solution: `using System;

class Car
{
    public string Brand = "";
    public void Honk() => Console.WriteLine("Beep!");
}

class Program
{
    static void Main()
    {
        Car myCar = new Car();
        myCar.Brand = "Toyota";
        myCar.Honk();
    }
}`,
          hint: "Declare the object with new Car() before accessing its members.",
        },
        quiz: {
          question: "What keyword creates a new instance of a class?",
          options: ["create", "instance", "new", "make"],
          answer: 2,
          explanation:
            "new allocates memory and calls the constructor to create an instance of the class.",
        },
      },

      // ── FIELDS ───────────────────────────────────────────────────────────
      {
        heading: "Fields",
        text: "Fields are variables declared directly inside a class. Public fields are accessible from outside; private fields are not. All fields get a default value (0, false, null) if not initialized.",
        code: {
          language: "csharp",
          snippet: `class Rectangle
{
    public double Width;
    public double Height;
    private string color = "white";

    public double Area() => Width * Height;
    public string GetColor() => color;
}

Rectangle r = new Rectangle();
r.Width = 5;
r.Height = 3;
Console.WriteLine(r.Area());
Console.WriteLine(r.GetColor());`,
          output: `15
white`,
        },
      },
      {
        heading: "Fields — Exercise 1",
        text: "Private fields can only be read or modified through the class's own methods.",
        fixExercise: {
          title: "Fix the direct access to a private field",
          broken: `using System;

class BankAccount
{
    private double balance = 0;
    public void Deposit(double amount) { balance += amount; }
    public double GetBalance() => balance;
}

class Program
{
    static void Main()
    {
        BankAccount acc = new BankAccount();
        acc.Deposit(100);
        acc.balance = 9999;
        Console.WriteLine(acc.GetBalance());
    }
}`,
          solution: `using System;

class BankAccount
{
    private double balance = 0;
    public void Deposit(double amount) { balance += amount; }
    public double GetBalance() => balance;
}

class Program
{
    static void Main()
    {
        BankAccount acc = new BankAccount();
        acc.Deposit(100);
        Console.WriteLine(acc.GetBalance());
    }
}`,
          hint: "balance is private and cannot be accessed directly from outside the class. Remove the direct assignment.",
        },
        quiz: {
          question:
            "What access modifier makes a field visible only within its own class?",
          options: ["public", "internal", "protected", "private"],
          answer: 3,
          explanation:
            "private restricts access to within the declaring class only.",
        },
      },

      // ── PROPERTIES ───────────────────────────────────────────────────────
      {
        heading: "Properties",
        text: "Properties are preferred over public fields because they let you add logic in get and set accessors. Auto-properties { get; set; } generate the backing field automatically.",
        code: {
          language: "csharp",
          snippet: `class Person
{
    private int age;
    public int Age
    {
        get { return age; }
        set
        {
            if (value >= 0) age = value;
        }
    }

    public string Name { get; set; } = "";
}

Person p = new Person();
p.Name = "Bob";
p.Age = 30;
p.Age = -5;   // ignored by setter
Console.WriteLine($"{p.Name} is {p.Age}");`,
          output: "Bob is 30",
        },
      },
      {
        heading: "Properties — Exercise 1",
        text: "A read-only property exposes a value without allowing external code to change it. Add a set accessor to make it writable.",
        fixExercise: {
          title: "Add write access to a read-only property",
          broken: `public class Employee
{
    private string name = "";
    public string Name
    {
        get { return name; }
    }
}`,
          solution: `public class Employee
{
    private string name = "";
    public string Name
    {
        get { return name; }
        set { name = value; }
    }
}`,
          hint: "The property currently has only a get accessor. Add set { name = value; } to allow writing.",
        },
        quiz: {
          question:
            "What keyword inside a set accessor refers to the incoming value?",
          options: ["input", "param", "value", "data"],
          answer: 2,
          explanation:
            "value is the implicit parameter in a set accessor that holds the assigned value.",
        },
      },

      // ── CONSTRUCTORS ─────────────────────────────────────────────────────
      {
        heading: "Constructors",
        text: "A constructor runs automatically when an object is created with new. It has the same name as the class and no return type. The default (parameterless) constructor is generated by the compiler if you do not define any.",
        code: {
          language: "csharp",
          snippet: `class Circle
{
    public double Radius;

    public Circle()
    {
        Radius = 1.0;
    }

    public Circle(double r)
    {
        Radius = r;
    }

    public double Area() => Math.PI * Radius * Radius;
}

Circle c1 = new Circle();
Circle c2 = new Circle(5);
Console.WriteLine(c1.Radius);
Console.WriteLine(Math.Round(c2.Area(), 2));`,
          output: `1
78.54`,
        },
      },
      {
        heading: "Constructors — Exercise 1",
        text: "A constructor must have the exact same name as its class. A different name is treated as a regular method.",
        fixExercise: {
          title: "Fix the misnamed constructor",
          broken: `using System;

class Dog
{
    public string Name;

    public void Dog(string name)
    {
        Name = name;
    }
}

class Program
{
    static void Main()
    {
        Dog d = new Dog("Rex");
        Console.WriteLine(d.Name);
    }
}`,
          solution: `using System;

class Dog
{
    public string Name;

    public Dog(string name)
    {
        Name = name;
    }
}

class Program
{
    static void Main()
    {
        Dog d = new Dog("Rex");
        Console.WriteLine(d.Name);
    }
}`,
          hint: "Constructors have no return type — not even void. Remove the void keyword.",
        },
        quiz: {
          question: "When is a constructor called?",
          options: [
            "When the class file is loaded",
            "When new is used to create an instance",
            "When the program starts",
            "When a method is called on an object",
          ],
          answer: 1,
          explanation:
            "Constructors run automatically each time new creates a new instance.",
        },
      },

      // ── DESTRUCTORS ──────────────────────────────────────────────────────
      {
        heading: "Destructors",
        text: "A destructor (~ClassName) is called by the garbage collector when an object is no longer referenced. You rarely need to write one explicitly in modern C#.",
        code: {
          language: "csharp",
          snippet: `class Resource
{
    public Resource() => Console.WriteLine("Constructed");
    ~Resource()       => Console.WriteLine("Destructed");
}

Resource r = new Resource();
Console.WriteLine("Object in use");`,
          output: `Constructed
Object in use
Destructed`,
        },
        quiz: {
          question:
            "What is the correct syntax for a destructor named MyClass?",
          options: [
            "void ~MyClass()",
            "~MyClass()",
            "delete MyClass()",
            "MyClass~()",
          ],
          answer: 1,
          explanation:
            "A destructor is declared with a tilde (~) before the class name and has no return type or parameters.",
        },
      },

      // ── VALUE VS REFERENCE ───────────────────────────────────────────────
      {
        heading: "Value vs Reference Types",
        text: "Value types (int, double, struct) copy their data on assignment. Reference types (class, array, string) copy the address — both variables then point to the same object.",
        code: {
          language: "csharp",
          snippet: `int a = 10;
int b = a;
b = 99;
Console.WriteLine(a);   // 10 — unchanged

int[] arr1 = { 1, 2, 3 };
int[] arr2 = arr1;
arr2[0] = 99;
Console.WriteLine(arr1[0]);  // 99 — both point to same array`,
          output: `10
99`,
        },
      },
      {
        heading: "Value vs Reference — Exercise 1",
        text: "Assigning one array to another does not copy the elements — it copies the reference. Both variables then share the same data.",
        fixExercise: {
          title: "Make an independent copy of the array",
          broken: `using System;

class Program
{
    static void Main()
    {
        int[] original = { 1, 2, 3 };
        int[] copy = original;
        copy[0] = 99;
        Console.WriteLine(original[0]);  // should still be 1
    }
}`,
          solution: `using System;

class Program
{
    static void Main()
    {
        int[] original = { 1, 2, 3 };
        int[] copy = (int[])original.Clone();
        copy[0] = 99;
        Console.WriteLine(original[0]);  // 1
    }
}`,
          hint: "Use Clone() or Array.Copy() to create an independent copy of an array.",
        },
        quiz: {
          question:
            "What happens when you assign one class instance to another variable?",
          options: [
            "A deep copy of the object is made",
            "Both variables point to the same object in memory",
            "The original variable is cleared",
            "A compile error occurs",
          ],
          answer: 1,
          explanation:
            "Class instances are reference types. Assignment copies the reference, so both variables share the same object.",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // STATIC MEMBERS AND NAMESPACES
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "static-members",
    title: "Static Members and Namespaces",
    subtitle:
      "Static fields/methods/constructors, the this keyword, and namespaces.",
    source: "Ch2_OOP.pdf",
    available: true,
    sections: [
      // ── STATIC FIELDS ────────────────────────────────────────────────────
      {
        heading: "Static Fields",
        text: "A static field belongs to the class, not to any individual instance. All objects of the class share the same value. Access it via ClassName.FieldName.",
        code: {
          language: "csharp",
          snippet: `class Person
{
    public static int Instances = 0;
    public string Name;

    public Person(string name)
    {
        Name = name;
        Instances++;
    }
}

new Person("Alice");
new Person("Bob");
Console.WriteLine(Person.Instances);`,
          output: "2",
        },
      },
      {
        heading: "Static Fields — Exercise 1",
        text: "Static fields are accessed through the class name, not through an object reference.",
        fixExercise: {
          title: "Fix the static field access",
          broken: `using System;

class Counter
{
    public static int Count = 0;
}

class Program
{
    static void Main()
    {
        Counter c = new Counter();
        c.Count++;
        Console.WriteLine(c.Count);
    }
}`,
          solution: `using System;

class Counter
{
    public static int Count = 0;
}

class Program
{
    static void Main()
    {
        Counter.Count++;
        Console.WriteLine(Counter.Count);
    }
}`,
          hint: "Static members are accessed with ClassName.MemberName, not through an instance.",
        },
        quiz: {
          question:
            "How many copies of a static field exist across all instances?",
          options: [
            "One per instance",
            "Zero — static fields are destroyed after creation",
            "One shared copy for the entire class",
            "Two — one for each thread",
          ],
          answer: 2,
          explanation:
            "Static fields have exactly one copy shared by all instances of the class.",
        },
      },

      // ── STATIC METHODS ───────────────────────────────────────────────────
      {
        heading: "Static Methods",
        text: "A static method belongs to the class. It can only access static members directly — it has no this reference. Utility methods like Math.Sqrt() are static.",
        code: {
          language: "csharp",
          snippet: `class MathHelper
{
    public static int Square(int n) => n * n;
    public static bool IsEven(int n) => n % 2 == 0;
}

Console.WriteLine(MathHelper.Square(4));
Console.WriteLine(MathHelper.IsEven(7));`,
          output: `16
False`,
        },
      },
      {
        heading: "Static Methods — Exercise 1",
        text: "A static method cannot reference instance members because it has no object context.",
        fixExercise: {
          title: "Fix the instance member access inside a static method",
          broken: `using System;

class Greeter
{
    public string Prefix = "Hello";

    public static void Greet(string name)
    {
        Console.WriteLine(Prefix + ", " + name + "!");
    }
}

class Program
{
    static void Main()
    {
        Greeter.Greet("Alice");
    }
}`,
          solution: `using System;

class Greeter
{
    public static string Prefix = "Hello";

    public static void Greet(string name)
    {
        Console.WriteLine(Prefix + ", " + name + "!");
    }
}

class Program
{
    static void Main()
    {
        Greeter.Greet("Alice");
    }
}`,
          hint: "A static method can only access static members. Make Prefix static.",
        },
        quiz: {
          question: "Which statement about static methods is correct?",
          options: [
            "They can access instance fields directly",
            "They require an object to be called",
            "They are called on the class, not on an instance",
            "They are always private",
          ],
          answer: 2,
          explanation:
            "Static methods are called via ClassName.Method() without creating an instance.",
        },
      },

      // ── STATIC CONSTRUCTOR ───────────────────────────────────────────────
      {
        heading: "Static Constructor",
        text: "A static constructor (static ClassName()) runs once, automatically, before the first use of the class. It has no access modifier and no parameters. Use it to initialize static fields.",
        code: {
          language: "csharp",
          snippet: `class Config
{
    public static string AppName;

    static Config()
    {
        AppName = "MyApp v1.0";
        Console.WriteLine("Static constructor called.");
    }
}

Console.WriteLine(Config.AppName);
Console.WriteLine(Config.AppName);`,
          output: `Static constructor called.
MyApp v1.0
MyApp v1.0`,
        },
        quiz: {
          question: "How many times does a static constructor run?",
          options: [
            "Once per instance",
            "Once per program run, before first use of the class",
            "Every time a static method is called",
            "Never automatically",
          ],
          answer: 1,
          explanation:
            "A static constructor runs exactly once, triggered by the first access to the class.",
        },
      },

      // ── THE this KEYWORD ─────────────────────────────────────────────────
      {
        heading: "The this Keyword",
        text: "this refers to the current instance. It is necessary when a parameter name shadows an instance field with the same name.",
        code: {
          language: "csharp",
          snippet: `class Point
{
    private int x;
    private int y;

    public Point(int x, int y)
    {
        this.x = x;
        this.y = y;
    }

    public void Print() => Console.WriteLine($"({x}, {y})");
}

new Point(3, 7).Print();`,
          output: "(3, 7)",
        },
      },
      {
        heading: "The this Keyword — Exercise 1",
        text: "Without this, writing name = name inside a constructor assigns the parameter to itself, leaving the field unchanged.",
        fixExercise: {
          title: "Fix the shadowed field assignment",
          broken: `using System;

class Employee
{
    private string name = "";

    public Employee(string name)
    {
        name = name;
    }

    public void Print() => Console.WriteLine(name);
}

class Program
{
    static void Main()
    {
        new Employee("Alice").Print();
    }
}`,
          solution: `using System;

class Employee
{
    private string name = "";

    public Employee(string name)
    {
        this.name = name;
    }

    public void Print() => Console.WriteLine(name);
}

class Program
{
    static void Main()
    {
        new Employee("Alice").Print();
    }
}`,
          hint: "Use this.name to distinguish the instance field from the parameter name.",
        },
        quiz: {
          question: "What does this refer to inside an instance method?",
          options: [
            "The class definition",
            "The current object instance",
            "The parent class",
            "The static version of the class",
          ],
          answer: 1,
          explanation:
            "this is a reference to the current object — the instance the method was called on.",
        },
      },

      // ── NAMESPACES ───────────────────────────────────────────────────────
      {
        heading: "Namespaces",
        text: "Namespaces organise related classes and prevent name collisions. using at the top of a file imports a namespace so you don't need the full qualified name.",
        code: {
          language: "csharp",
          snippet: `using System;

namespace Geometry
{
    class Circle
    {
        public double Radius;
        public double Area() => Math.PI * Radius * Radius;
    }
}

Geometry.Circle c = new Geometry.Circle { Radius = 5 };
Console.WriteLine(Math.Round(c.Area(), 2));`,
          output: "78.54",
        },
      },
      {
        heading: "Namespaces — Exercise 1",
        text: "Without the correct using directive, the compiler cannot find the type. Add the directive to resolve the error.",
        fixExercise: {
          title: "Add the missing using directive",
          broken: `class Program
{
    static void Main()
    {
        Console.WriteLine("Hello");
        List<int> numbers = new List<int> { 1, 2, 3 };
    }
}`,
          solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello");
        List<int> numbers = new List<int> { 1, 2, 3 };
    }
}`,
          hint: "Console lives in System. List<T> lives in System.Collections.Generic.",
        },
        quiz: {
          question: "What is the purpose of a namespace?",
          options: [
            "To speed up compilation",
            "To organise classes and avoid name collisions",
            "To declare global variables",
            "To define access modifiers",
          ],
          answer: 1,
          explanation:
            "Namespaces group related types and prevent naming conflicts between libraries.",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ENCAPSULATION AND OVERLOADING
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "encapsulation",
    title: "Encapsulation and Overloading",
    subtitle:
      "Access levels, method overloading, constructor overloading, and operator overloading.",
    source: "Ch3_OOP.pdf",
    available: true,
    sections: [
      // ── ACCESS SPECIFIERS ────────────────────────────────────────────────
      {
        heading: "Access Specifiers",
        text: "Access specifiers control visibility: public (everywhere), private (class only), protected (class + subclasses), internal (same assembly). Use the most restrictive level that still works.",
        code: {
          language: "csharp",
          snippet: `class Vehicle
{
    public string Brand = "Generic";     // accessible everywhere
    private int _mileage = 0;            // only inside this class
    protected string FuelType = "Gas";   // this class and subclasses

    public void Drive(int km) { _mileage += km; }
    public int GetMileage() => _mileage;
}

Vehicle v = new Vehicle();
v.Brand = "Toyota";
v.Drive(100);
Console.WriteLine(v.Brand + ": " + v.GetMileage() + " km");`,
          output: "Toyota: 100 km",
        },
      },
      {
        heading: "Access Specifiers — Exercise 1",
        text: "Exposing internal state only through methods is the core of encapsulation — it lets you validate or log changes.",
        fixExercise: {
          title: "Fix the access violation",
          broken: `using System;

class Temperature
{
    private double celsius;

    public void SetCelsius(double value)
    {
        if (value >= -273.15) celsius = value;
    }

    public double GetCelsius() => celsius;
}

class Program
{
    static void Main()
    {
        Temperature t = new Temperature();
        t.celsius = -300;
        Console.WriteLine(t.GetCelsius());
    }
}`,
          solution: `using System;

class Temperature
{
    private double celsius;

    public void SetCelsius(double value)
    {
        if (value >= -273.15) celsius = value;
    }

    public double GetCelsius() => celsius;
}

class Program
{
    static void Main()
    {
        Temperature t = new Temperature();
        t.SetCelsius(-300);
        Console.WriteLine(t.GetCelsius());
    }
}`,
          hint: "celsius is private. Use SetCelsius() so the validation runs.",
        },
        quiz: {
          question:
            "Which specifier allows access within the class and in derived classes?",
          options: ["private", "public", "protected", "internal"],
          answer: 2,
          explanation:
            "protected is visible in the declaring class and all classes that inherit from it.",
        },
      },

      // ── METHOD OVERLOADING ───────────────────────────────────────────────
      {
        heading: "Method Overloading",
        text: "Overloading defines multiple methods with the same name but different parameter lists. The compiler picks the correct version at compile time based on the arguments.",
        code: {
          language: "csharp",
          snippet: `class Printer
{
    public void Print(string text)
    {
        Console.WriteLine(text);
    }

    public void Print(int number)
    {
        Console.WriteLine("Number: " + number);
    }

    public void Print(string text, int times)
    {
        for (int i = 0; i < times; i++)
            Console.WriteLine(text);
    }
}

Printer p = new Printer();
p.Print("Hello");
p.Print(42);
p.Print("Hi", 2);`,
          output: `Hello
Number: 42
Hi
Hi`,
        },
      },
      {
        heading: "Method Overloading — Exercise 1",
        text: "Overloaded methods must differ in the number or types of their parameters — differing only in return type is not enough.",
        fixExercise: {
          title: "Fix the invalid overload (same signature)",
          broken: `using System;

class Calculator
{
    public int Add(int a, int b) => a + b;
    public double Add(int a, int b) => a + b;
}

class Program
{
    static void Main()
    {
        Calculator c = new Calculator();
        Console.WriteLine(c.Add(3, 4));
    }
}`,
          solution: `using System;

class Calculator
{
    public int Add(int a, int b) => a + b;
    public double Add(double a, double b) => a + b;
}

class Program
{
    static void Main()
    {
        Calculator c = new Calculator();
        Console.WriteLine(c.Add(3, 4));
        Console.WriteLine(c.Add(3.5, 4.5));
    }
}`,
          hint: "Two methods with the same name must differ in parameter types or count, not just return type.",
        },
        quiz: {
          question:
            "What distinguishes two overloaded methods with the same name?",
          options: [
            "Different return types only",
            "Different access modifiers",
            "Different parameter types or count",
            "Different method bodies",
          ],
          answer: 2,
          explanation:
            "Overloaded methods must differ in their parameter list (type, count, or order).",
        },
      },

      // ── CONSTRUCTOR OVERLOADING ───────────────────────────────────────────
      {
        heading: "Constructor Overloading",
        text: "A class can have multiple constructors with different parameter lists. Use : this(...) to delegate from one constructor to another to avoid repeating code.",
        code: {
          language: "csharp",
          snippet: `public class Time
{
    public int Hour   { get; set; }
    public int Minute { get; set; }

    public Time() : this(0, 0) { }
    public Time(int h) : this(h, 0) { }
    public Time(int h, int m)
    {
        Hour = h;
        Minute = m;
    }

    public override string ToString() => $"{Hour:00}:{Minute:00}";
}

Console.WriteLine(new Time());
Console.WriteLine(new Time(9));
Console.WriteLine(new Time(14, 30));`,
          output: `00:00
09:00
14:30`,
        },
      },
      {
        heading: "Constructor Overloading — Exercise 1",
        text: "When two constructors share logic, delegate to the most complete one using : this(...) to avoid duplication.",
        fixExercise: {
          title: "Eliminate duplicated initialisation logic",
          broken: `using System;

class Box
{
    public double Width, Height, Depth;

    public Box()
    {
        Width = 1;
        Height = 1;
        Depth = 1;
    }

    public Box(double w, double h, double d)
    {
        Width = w;
        Height = h;
        Depth = d;
    }
}`,
          solution: `using System;

class Box
{
    public double Width, Height, Depth;

    public Box() : this(1, 1, 1) { }

    public Box(double w, double h, double d)
    {
        Width = w;
        Height = h;
        Depth = d;
    }
}`,
          hint: "Use : this(1, 1, 1) on the parameterless constructor to call the three-parameter one.",
        },
        quiz: {
          question:
            "What syntax calls another constructor from within a constructor?",
          options: [": base(...)", ": this(...)", "call(...)", "super(...)"],
          answer: 1,
          explanation:
            ": this(...) chains to another constructor in the same class.",
        },
      },

      // ── OPERATOR OVERLOADING ─────────────────────────────────────────────
      {
        heading: "Operator Overloading",
        text: "You can redefine what operators like + or == do for your class using the operator keyword. The method must be public and static.",
        code: {
          language: "csharp",
          snippet: `class Vector2D
{
    public double X, Y;

    public Vector2D(double x, double y) { X = x; Y = y; }

    public static Vector2D operator +(Vector2D a, Vector2D b)
        => new Vector2D(a.X + b.X, a.Y + b.Y);

    public override string ToString() => $"({X}, {Y})";
}

Vector2D v1 = new Vector2D(1, 2);
Vector2D v2 = new Vector2D(3, 4);
Console.WriteLine(v1 + v2);`,
          output: "(4, 6)",
        },
        quiz: {
          question:
            "What modifiers are required on an overloaded operator method?",
          options: [
            "private and static",
            "public and static",
            "public and virtual",
            "protected and static",
          ],
          answer: 1,
          explanation: "Operator overloads must be declared public and static.",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COMPOSITION
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "composition",
    title: "Composition",
    subtitle:
      "Composition vs aggregation, nested classes, and partial classes.",
    source: "Ch4_OOP.pdf",
    available: true,
    sections: [
      // ── COMPOSITION ──────────────────────────────────────────────────────
      {
        heading: "Composition",
        text: "Composition is a 'has-a' relationship where the contained object cannot exist independently of the container. When the container is destroyed, its parts are too.",
        code: {
          language: "csharp",
          snippet: `class Engine
{
    public int Horsepower;
    public Engine(int hp) { Horsepower = hp; }
}

class Car
{
    private Engine engine;

    public Car(int hp)
    {
        engine = new Engine(hp);
    }

    public void ShowPower() => Console.WriteLine(engine.Horsepower + " HP");
}

Car car = new Car(200);
car.ShowPower();`,
          output: "200 HP",
        },
      },
      {
        heading: "Composition — Exercise 1",
        text: "In composition the contained object is created inside the container's constructor, not passed in from outside.",
        fixExercise: {
          title: "Fix the composition — create Engine inside Car",
          broken: `using System;

class Engine { public string Type = "V8"; }

class Car
{
    public Engine engine;
}

class Program
{
    static void Main()
    {
        Car car = new Car();
        Console.WriteLine(car.engine.Type);
    }
}`,
          solution: `using System;

class Engine { public string Type = "V8"; }

class Car
{
    private Engine engine = new Engine();
    public string EngineType => engine.Type;
}

class Program
{
    static void Main()
    {
        Car car = new Car();
        Console.WriteLine(car.EngineType);
    }
}`,
          hint: "Create the Engine instance inside Car and expose it via a property rather than making it public.",
        },
        quiz: {
          question: "Which statement best describes composition?",
          options: [
            "Two independent objects share a reference",
            "A contained object lives and dies with its container",
            "A class inherits behaviour from another class",
            "Objects are created from an interface",
          ],
          answer: 1,
          explanation:
            "In composition the part cannot exist without the whole — their lifetimes are coupled.",
        },
      },

      // ── AGGREGATION ──────────────────────────────────────────────────────
      {
        heading: "Aggregation",
        text: "Aggregation is a looser 'has-a' where the contained object can exist independently. The outer class receives a reference to an already-existing object.",
        code: {
          language: "csharp",
          snippet: `class Teacher
{
    public string Name;
    public Teacher(string name) { Name = name; }
}

class Classroom
{
    private Teacher teacher;

    public Classroom(Teacher t)
    {
        teacher = t;      // Teacher already exists outside
    }

    public void Info() => Console.WriteLine("Teacher: " + teacher.Name);
}

Teacher alice = new Teacher("Alice");
Classroom room = new Classroom(alice);
room.Info();
Console.WriteLine(alice.Name + " still exists");`,
          output: `Teacher: Alice
Alice still exists`,
        },
      },
      {
        heading: "Aggregation — Exercise 1",
        text: "Unlike composition, in aggregation the contained object is passed in (injected), not created inside the constructor.",
        fixExercise: {
          title: "Convert composition to aggregation",
          broken: `using System;

class Pilot { public string Name = "Bob"; }

class Plane
{
    private Pilot pilot = new Pilot();
    public void Show() => Console.WriteLine(pilot.Name);
}

class Program
{
    static void Main()
    {
        Plane p = new Plane();
        p.Show();
    }
}`,
          solution: `using System;

class Pilot { public string Name; public Pilot(string n) { Name = n; } }

class Plane
{
    private Pilot pilot;
    public Plane(Pilot p) { pilot = p; }
    public void Show() => Console.WriteLine(pilot.Name);
}

class Program
{
    static void Main()
    {
        Pilot pilot = new Pilot("Bob");
        Plane plane = new Plane(pilot);
        plane.Show();
    }
}`,
          hint: "Accept the Pilot as a constructor parameter instead of creating it inside Plane.",
        },
        quiz: {
          question:
            "What is the key difference between composition and aggregation?",
          options: [
            "Composition uses interfaces; aggregation does not",
            "In aggregation the contained object can outlive the container",
            "Aggregation only works with value types",
            "There is no practical difference",
          ],
          answer: 1,
          explanation:
            "In aggregation the contained object exists independently and can outlive the container.",
        },
      },

      // ── NESTED CLASSES ───────────────────────────────────────────────────
      {
        heading: "Nested Classes",
        text: "A class declared inside another class is a nested class. It is scoped to its outer class and is useful for implementation details that should not be visible outside.",
        code: {
          language: "csharp",
          snippet: `class OuterClass
{
    private int secret = 42;

    public class InnerClass
    {
        public void Greet() => Console.WriteLine("Hello from Inner!");
    }

    public void ShowSecret(InnerClass ic)
    {
        Console.WriteLine("Secret: " + secret);
    }
}

OuterClass.InnerClass inner = new OuterClass.InnerClass();
inner.Greet();`,
          output: "Hello from Inner!",
        },
      },
      {
        heading: "Nested Classes — Exercise 1",
        text: "A public nested class is accessed as OuterClass.InnerClass from outside the outer class.",
        fixExercise: {
          title: "Fix the nested class instantiation",
          broken: `using System;

class Library
{
    public class Book
    {
        public string Title = "Unknown";
    }
}

class Program
{
    static void Main()
    {
        Book b = new Book();
        b.Title = "C# Basics";
        Console.WriteLine(b.Title);
    }
}`,
          solution: `using System;

class Library
{
    public class Book
    {
        public string Title = "Unknown";
    }
}

class Program
{
    static void Main()
    {
        Library.Book b = new Library.Book();
        b.Title = "C# Basics";
        Console.WriteLine(b.Title);
    }
}`,
          hint: "A nested class must be qualified with its outer class name: Library.Book.",
        },
        quiz: {
          question: "Where is a nested class visible when declared as private?",
          options: [
            "Everywhere in the assembly",
            "Only within its enclosing outer class",
            "Only within the same namespace",
            "In the outer class and all derived classes",
          ],
          answer: 1,
          explanation:
            "A private nested class is accessible only inside the outer class that contains it.",
        },
      },

      // ── PARTIAL CLASSES ──────────────────────────────────────────────────
      {
        heading: "Partial Classes",
        text: "The partial keyword splits a class definition across multiple files. All parts must use partial and the same class name. The compiler merges them into one class.",
        code: {
          language: "csharp",
          snippet: `// File 1
public partial class Employee
{
    public void DoWork() => Console.WriteLine("Working...");
}

// File 2
public partial class Employee
{
    public void GoToLunch() => Console.WriteLine("Lunch time!");
}

Employee e = new Employee();
e.DoWork();
e.GoToLunch();`,
          output: `Working...
Lunch time!`,
        },
      },
      {
        heading: "Partial Classes — Exercise 1",
        text: "Every part of a partial class must include the partial keyword, otherwise the compiler sees two duplicate class definitions and reports an error.",
        fixExercise: {
          title: "Mark both parts as partial",
          broken: `public class Employee
{
    public void DoWork() { }
}

public class Employee
{
    public void GoToLunch() { }
}`,
          solution: `public partial class Employee
{
    public void DoWork() { }
}

public partial class Employee
{
    public void GoToLunch() { }
}`,
          hint: "Add the partial keyword to both class declarations.",
        },
        quiz: {
          question: "What keyword splits a class across multiple files?",
          options: ["split", "shared", "partial", "multi"],
          answer: 2,
          explanation:
            "The partial keyword allows a class definition to span multiple files.",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INHERITANCE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "inheritance",
    title: "Inheritance",
    subtitle:
      "Base/derived relation, protected, virtual/override, base keyword, ToString override, and sealed.",
    source: "Ch5_OOP.pdf",
    available: true,
    sections: [
      // ── BASE AND DERIVED ──────────────────────────────────────────────────
      {
        heading: "Base and Derived Classes",
        text: "Inheritance lets a derived class reuse and extend a base class. Use the colon (:) syntax. C# supports single direct inheritance for classes.",
        code: {
          language: "csharp",
          snippet: `class Animal
{
    public string Name;
    public void Eat() => Console.WriteLine(Name + " is eating.");
}

class Dog : Animal
{
    public void Bark() => Console.WriteLine(Name + " says Woof!");
}

Dog d = new Dog();
d.Name = "Rex";
d.Eat();
d.Bark();`,
          output: `Rex is eating.
Rex says Woof!`,
        },
      },
      {
        heading: "Base / Derived — Exercise 1",
        text: "A derived class automatically inherits all public and protected members of its base class.",
        fixExercise: {
          title: "Fix the broken inheritance declaration",
          broken: `using System;

class Shape
{
    public string Color = "Red";
}

class Circle extends Shape
{
    public double Radius = 5;
}

class Program
{
    static void Main()
    {
        Circle c = new Circle();
        Console.WriteLine(c.Color + " circle, radius " + c.Radius);
    }
}`,
          solution: `using System;

class Shape
{
    public string Color = "Red";
}

class Circle : Shape
{
    public double Radius = 5;
}

class Program
{
    static void Main()
    {
        Circle c = new Circle();
        Console.WriteLine(c.Color + " circle, radius " + c.Radius);
    }
}`,
          hint: "C# uses a colon (:) for inheritance, not the extends keyword.",
        },
        quiz: {
          question: "How many direct base classes can a C# class inherit from?",
          options: ["Unlimited", "Two", "One", "Zero"],
          answer: 2,
          explanation:
            "C# classes support single direct inheritance. A class can implement multiple interfaces.",
        },
      },

      // ── PROTECTED ────────────────────────────────────────────────────────
      {
        heading: "Protected Members",
        text: "protected members are accessible in the declaring class and in any class that inherits from it, but not from outside.",
        code: {
          language: "csharp",
          snippet: `class Vehicle
{
    protected int Speed = 0;

    public void Accelerate(int amount) { Speed += amount; }
}

class Car : Vehicle
{
    public void ShowSpeed() => Console.WriteLine("Speed: " + Speed);
}

Car c = new Car();
c.Accelerate(60);
c.ShowSpeed();`,
          output: "Speed: 60",
        },
      },
      {
        heading: "Protected Members — Exercise 1",
        text: "A protected field is accessible in subclasses but not from unrelated classes.",
        fixExercise: {
          title: "Fix the access to a protected field from outside",
          broken: `using System;

class Animal
{
    protected string sound = "...";
}

class Program
{
    static void Main()
    {
        Animal a = new Animal();
        Console.WriteLine(a.sound);
    }
}`,
          solution: `using System;

class Animal
{
    protected string sound = "...";
    public string GetSound() => sound;
}

class Program
{
    static void Main()
    {
        Animal a = new Animal();
        Console.WriteLine(a.GetSound());
    }
}`,
          hint: "Add a public method that returns sound, since protected fields are not accessible outside the class hierarchy.",
        },
        quiz: {
          question: "Where can a protected member be accessed?",
          options: [
            "Everywhere in the application",
            "Only inside its own class",
            "In its class and all derived classes",
            "Only in the same file",
          ],
          answer: 2,
          explanation:
            "protected allows access within the declaring class and any class that inherits from it.",
        },
      },

      // ── VIRTUAL AND OVERRIDE ─────────────────────────────────────────────
      {
        heading: "Virtual and Override",
        text: "Mark a base method virtual to allow derived classes to override it with override. The runtime calls the most derived version — this is runtime polymorphism.",
        code: {
          language: "csharp",
          snippet: `class Shape
{
    public virtual void Display() => Console.WriteLine("Shape");
}

class Circle : Shape
{
    public override void Display() => Console.WriteLine("Circle");
}

class Square : Shape
{
    public override void Display() => Console.WriteLine("Square");
}

Shape s1 = new Circle();
Shape s2 = new Square();
s1.Display();
s2.Display();`,
          output: `Circle
Square`,
        },
      },
      {
        heading: "Virtual / Override — Exercise 1",
        text: "Forgetting virtual on the base method means derived classes cannot properly override it — the override keyword will cause a compile error.",
        fixExercise: {
          title: "Fix the missing virtual keyword",
          broken: `using System;

class Animal
{
    public void Speak() => Console.WriteLine("...");
}

class Cat : Animal
{
    public override void Speak() => Console.WriteLine("Meow");
}

class Program
{
    static void Main()
    {
        Animal a = new Cat();
        a.Speak();
    }
}`,
          solution: `using System;

class Animal
{
    public virtual void Speak() => Console.WriteLine("...");
}

class Cat : Animal
{
    public override void Speak() => Console.WriteLine("Meow");
}

class Program
{
    static void Main()
    {
        Animal a = new Cat();
        a.Speak();
    }
}`,
          hint: "Add virtual to Animal.Speak() so that Cat can use override.",
        },
        quiz: {
          question:
            "What keyword allows a derived class to replace a base class method at runtime?",
          options: ["new", "hide", "override", "replace"],
          answer: 2,
          explanation:
            "override replaces the base method in runtime dispatch. new hides it without polymorphism.",
        },
      },

      // ── base() CONSTRUCTOR CHAINING ───────────────────────────────────────
      {
        heading: "Calling the Base Constructor with base()",
        text: "Use : base(...) after the constructor signature to call a specific base class constructor. The base constructor always runs before the derived constructor body.",
        code: {
          language: "csharp",
          snippet: `class Person
{
    public string Name;
    public Person(string name) { Name = name; }
}

class Student : Person
{
    public int StudentId;

    public Student(string name, int id) : base(name)
    {
        StudentId = id;
    }
}

Student s = new Student("Alice", 1001);
Console.WriteLine($"{s.Name} — ID {s.StudentId}");`,
          output: "Alice — ID 1001",
        },
      },
      {
        heading: "base() Practice — Exercise 1",
        text: "If the base class has no parameterless constructor, the derived class must explicitly call one of the base constructors using : base(...).",
        fixExercise: {
          title: "Add the missing base constructor call",
          broken: `using System;

class Animal
{
    public string Name;
    public Animal(string name) { Name = name; }
}

class Bird : Animal
{
    public string Species;

    public Bird(string name, string species)
    {
        Species = species;
    }
}

class Program
{
    static void Main()
    {
        Bird b = new Bird("Tweety", "Canary");
        Console.WriteLine($"{b.Name} ({b.Species})");
    }
}`,
          solution: `using System;

class Animal
{
    public string Name;
    public Animal(string name) { Name = name; }
}

class Bird : Animal
{
    public string Species;

    public Bird(string name, string species) : base(name)
    {
        Species = species;
    }
}

class Program
{
    static void Main()
    {
        Bird b = new Bird("Tweety", "Canary");
        Console.WriteLine($"{b.Name} ({b.Species})");
    }
}`,
          hint: "Add : base(name) after the constructor parameters to pass name to Animal's constructor.",
        },
        quiz: {
          question:
            "When does the base constructor body run relative to the derived constructor?",
          options: [
            "After the derived constructor body",
            "At the same time",
            "Before the derived constructor body",
            "Only when explicitly called in the body",
          ],
          answer: 2,
          explanation:
            "The base constructor always runs first, before the derived class constructor body executes.",
        },
      },

      // ── OVERRIDING ToString ───────────────────────────────────────────────
      {
        heading: "Overriding ToString",
        text: "Every class inherits ToString() from object. Override it to return a meaningful string representation, which is also used by Console.WriteLine().",
        code: {
          language: "csharp",
          snippet: `class Book
{
    public string Title;
    public string Author;

    public Book(string title, string author)
    {
        Title = title;
        Author = author;
    }

    public override string ToString()
    {
        return $"\"{Title}\" by {Author}";
    }
}

Book b = new Book("Clean Code", "Robert Martin");
Console.WriteLine(b);`,
          output: `"Clean Code" by Robert Martin`,
        },
      },
      {
        heading: "Overriding ToString — Exercise 1",
        text: "Without an override, Console.WriteLine(object) prints the fully qualified type name, which is rarely useful.",
        fixExercise: {
          title: "Override ToString to show meaningful output",
          broken: `using System;

class Point
{
    public int X, Y;
    public Point(int x, int y) { X = x; Y = y; }
}

class Program
{
    static void Main()
    {
        Point p = new Point(3, 5);
        Console.WriteLine(p);  // currently prints: Point
    }
}`,
          solution: `using System;

class Point
{
    public int X, Y;
    public Point(int x, int y) { X = x; Y = y; }

    public override string ToString() => $"({X}, {Y})";
}

class Program
{
    static void Main()
    {
        Point p = new Point(3, 5);
        Console.WriteLine(p);  // (3, 5)
    }
}`,
          hint: "Add public override string ToString() that returns a formatted string.",
        },
        quiz: {
          question: "Which class does ToString() originally come from?",
          options: ["String", "Console", "object", "System"],
          answer: 2,
          explanation:
            "Every C# class implicitly inherits from object, which defines ToString().",
        },
      },

      // ── SEALED ───────────────────────────────────────────────────────────
      {
        heading: "Sealed Classes",
        text: "A sealed class cannot be used as a base class. It prevents further inheritance, which can improve performance and security. string is a well-known sealed type.",
        code: {
          language: "csharp",
          snippet: `sealed class FinalClass
{
    public void Hello() => Console.WriteLine("I cannot be inherited.");
}

// This would be a compile error:
// class Child : FinalClass { }

FinalClass f = new FinalClass();
f.Hello();`,
          output: "I cannot be inherited.",
        },
        quiz: {
          question: "What does the sealed keyword do when applied to a class?",
          options: [
            "Prevents the class from being instantiated",
            "Makes all members private",
            "Prevents other classes from inheriting from it",
            "Marks the class as abstract",
          ],
          answer: 2,
          explanation:
            "sealed stops a class from being used as a base class for inheritance.",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POLYMORPHISM
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "polymorphism",
    title: "Method Hiding and Polymorphism",
    subtitle:
      "Compile-time vs runtime polymorphism, overloading, overriding, method hiding with new, and upcasting.",
    source: "Ch6_OOP.pdf",
    available: true,
    sections: [
      // ── OVERLOADING (COMPILE-TIME) ────────────────────────────────────────
      {
        heading: "Compile-time Polymorphism — Overloading",
        text: "Overloading means multiple methods share a name but have different parameter lists. The compiler resolves which version to call at compile time, so it is called static (compile-time) polymorphism.",
        code: {
          language: "csharp",
          snippet: `class Display
{
    public void Show(int n)    => Console.WriteLine("int: " + n);
    public void Show(double d) => Console.WriteLine("double: " + d);
    public void Show(string s) => Console.WriteLine("string: " + s);
}

Display d = new Display();
d.Show(5);
d.Show(3.14);
d.Show("Hello");`,
          output: `int: 5
double: 3.14
string: Hello`,
        },
      },
      {
        heading: "Overloading — Exercise 1",
        text: "The compiler picks the best matching overload based on argument types. Ambiguous calls that match two overloads equally cause a compile error.",
        fixExercise: {
          title: "Add the missing overload to handle a double argument",
          broken: `using System;

class Formatter
{
    public string Format(int n) => "int: " + n;
    public string Format(string s) => "string: " + s;
}

class Program
{
    static void Main()
    {
        Formatter f = new Formatter();
        Console.WriteLine(f.Format(3.14));
    }
}`,
          solution: `using System;

class Formatter
{
    public string Format(int n)    => "int: " + n;
    public string Format(string s) => "string: " + s;
    public string Format(double d) => "double: " + d;
}

class Program
{
    static void Main()
    {
        Formatter f = new Formatter();
        Console.WriteLine(f.Format(3.14));
    }
}`,
          hint: "Add a Format(double d) overload to handle the double argument.",
        },
        quiz: {
          question: "At what stage is an overloaded method call resolved?",
          options: [
            "At startup",
            "At runtime",
            "At compile time",
            "On first call only",
          ],
          answer: 2,
          explanation:
            "Overloading is compile-time (static) polymorphism — the compiler selects the version.",
        },
      },

      // ── OVERRIDING (RUNTIME) ─────────────────────────────────────────────
      {
        heading: "Runtime Polymorphism — Overriding",
        text: "When a base-type variable holds a derived object and you call a virtual method, C# calls the derived override at runtime. This is dynamic dispatch.",
        code: {
          language: "csharp",
          snippet: `class Animal
{
    public virtual string Sound() => "...";
}

class Dog : Animal
{
    public override string Sound() => "Woof";
}

class Cat : Animal
{
    public override string Sound() => "Meow";
}

Animal[] animals = { new Dog(), new Cat(), new Dog() };
foreach (Animal a in animals)
    Console.WriteLine(a.Sound());`,
          output: `Woof
Meow
Woof`,
        },
      },
      {
        heading: "Overriding — Exercise 1",
        text: "Runtime polymorphism requires both virtual on the base and override on the derived. Missing either defeats dynamic dispatch.",
        fixExercise: {
          title: "Fix the missing virtual and override keywords",
          broken: `using System;

class Printer
{
    public void Print() => Console.WriteLine("Base print");
}

class ColorPrinter : Printer
{
    public void Print() => Console.WriteLine("Color print");
}

class Program
{
    static void Main()
    {
        Printer p = new ColorPrinter();
        p.Print();  // should print "Color print"
    }
}`,
          solution: `using System;

class Printer
{
    public virtual void Print() => Console.WriteLine("Base print");
}

class ColorPrinter : Printer
{
    public override void Print() => Console.WriteLine("Color print");
}

class Program
{
    static void Main()
    {
        Printer p = new ColorPrinter();
        p.Print();  // Color print
    }
}`,
          hint: "Add virtual to Printer.Print() and override to ColorPrinter.Print().",
        },
        quiz: {
          question: "What type of polymorphism uses virtual and override?",
          options: [
            "Compile-time polymorphism",
            "Static polymorphism",
            "Runtime polymorphism",
            "Interface polymorphism",
          ],
          answer: 2,
          explanation:
            "virtual/override enables runtime (dynamic) polymorphism — the correct version is chosen at runtime.",
        },
      },

      // ── METHOD HIDING ────────────────────────────────────────────────────
      {
        heading: "Method Hiding with new",
        text: "The new keyword intentionally hides a base class member with a same-name derived member. Unlike override, there is no runtime dispatch — the declared type of the variable determines which version runs.",
        code: {
          language: "csharp",
          snippet: `class A
{
    public virtual void F() => Console.WriteLine("A.F");
}

class B : A
{
    public new void F() => Console.WriteLine("B.F (hidden)");
}

B b = new B();
b.F();          // B.F

A a = new B();
a.F();          // A.F — no polymorphism with new`,
          output: `B.F (hidden)
A.F`,
        },
      },
      {
        heading: "Method Hiding — Exercise 1",
        text: "When a derived method uses new instead of override, calling through a base-type reference always invokes the base version.",
        fixExercise: {
          title: "Change hiding to override for true polymorphism",
          broken: `using System;

class Logger
{
    public virtual void Log(string msg) => Console.WriteLine("[BASE] " + msg);
}

class FileLogger : Logger
{
    public new void Log(string msg) => Console.WriteLine("[FILE] " + msg);
}

class Program
{
    static void Main()
    {
        Logger logger = new FileLogger();
        logger.Log("Error");  // should print [FILE] Error
    }
}`,
          solution: `using System;

class Logger
{
    public virtual void Log(string msg) => Console.WriteLine("[BASE] " + msg);
}

class FileLogger : Logger
{
    public override void Log(string msg) => Console.WriteLine("[FILE] " + msg);
}

class Program
{
    static void Main()
    {
        Logger logger = new FileLogger();
        logger.Log("Error");  // [FILE] Error
    }
}`,
          hint: "Replace new with override so that Logger reference uses FileLogger's version at runtime.",
        },
        quiz: {
          question: "What does new do in a derived member declaration?",
          options: [
            "It enables runtime dispatch automatically",
            "It hides the base member without polymorphism",
            "It forces a call to the base method",
            "It works only for fields",
          ],
          answer: 1,
          explanation:
            "new creates a separate member that hides the base; it does not change runtime dispatch.",
        },
      },

      // ── UPCASTING / DOWNCASTING ───────────────────────────────────────────
      {
        heading: "Upcasting and Downcasting",
        text: "Upcasting (derived → base) is implicit and safe. Downcasting (base → derived) requires an explicit cast and throws InvalidCastException if the object is the wrong type. Use is and as for safe checks.",
        code: {
          language: "csharp",
          snippet: `class Animal { public virtual void Speak() => Console.WriteLine("..."); }
class Dog : Animal   { public override void Speak() => Console.WriteLine("Woof"); }
class Cat : Animal   { public override void Speak() => Console.WriteLine("Meow"); }

Animal a = new Dog();    // upcast (implicit)
a.Speak();               // Woof

if (a is Dog dog)        // safe downcast with pattern matching
    Console.WriteLine("It's a dog!");

Animal b = new Cat();
Dog? d = b as Dog;       // returns null if wrong type
Console.WriteLine(d == null ? "Not a dog" : "Dog");`,
          output: `Woof
It's a dog!
Not a dog`,
        },
      },
      {
        heading: "Upcasting / Downcasting — Exercise 1",
        text: "A direct explicit cast to the wrong type throws InvalidCastException. Use as or is to cast safely.",
        fixExercise: {
          title: "Fix the unsafe downcast with as",
          broken: `using System;

class Shape { }
class Circle : Shape { public double Radius = 5; }

class Program
{
    static void Main()
    {
        Shape s = new Shape();
        Circle c = (Circle)s;
        Console.WriteLine(c.Radius);
    }
}`,
          solution: `using System;

class Shape { }
class Circle : Shape { public double Radius = 5; }

class Program
{
    static void Main()
    {
        Shape s = new Shape();
        Circle? c = s as Circle;
        if (c != null)
            Console.WriteLine(c.Radius);
        else
            Console.WriteLine("s is not a Circle");
    }
}`,
          hint: "Use as to attempt the cast — it returns null instead of throwing on failure.",
        },
        quiz: {
          question: "What does the as operator return when the cast fails?",
          options: ["0", "false", "null", "It throws an exception"],
          answer: 2,
          explanation:
            "as returns null if the object cannot be cast to the target type instead of throwing.",
        },
      },
    ],
  },
];

export const csharpTopicMap = new Map(
  csharpTopics.map((topic) => [topic.slug, topic]),
);

export function getCsharpTopic(slug: string): CsharpTopic | undefined {
  return csharpTopicMap.get(slug);
}
