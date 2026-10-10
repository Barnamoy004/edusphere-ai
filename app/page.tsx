"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  BookOpen,
  Bot,
  User,
  CalendarDays,
  Check,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Moon,
  Plus,
  Search,
  Sun,
  Target,
  Trash2,
  Video,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const courses = [
  {
    id: 1,
    title: "C Programming",
    category: "Programming",
    level: "Beginner",
    progress: 0,
    lessons: "0 / 10 lessons",
    next: "Introduction to C",
    duration: "6 weeks",
    lessonTopics: [
      "Introduction to C",
      "Variables and Data Types",
      "Operators",
      "Conditional Statements",
      "Loops",
      "Arrays",
      "Strings",
      "Functions",
      "Pointers",
      "Structures",
    ],
  },
  {
    id: 2,
    title: "Python Programming",
    category: "Programming",
    level: "Beginner",
    progress: 0,
    lessons: "0 / 10 lessons",
    next: "Introduction to Python",
    duration: "8 weeks",
    lessonTopics: [
      "Introduction to Python",
      "Variables and Data Types",
      "Operators",
      "Conditional Statements",
      "Loops",
      "Lists and Tuples",
      "Dictionaries and Sets",
      "Functions",
      "File Handling",
      "Object-Oriented Programming",
    ],
  },
  {
    id: 3,
    title: "Java Programming",
    category: "Programming",
    level: "Intermediate",
    progress: 0,
    lessons: "0 / 10 lessons",
    next: "Introduction to Java",
    duration: "8 weeks",
    lessonTopics: [
      "Introduction to Java",
      "Variables and Data Types",
      "Operators",
      "Conditional Statements",
      "Loops",
      "Arrays",
      "Classes and Objects",
      "Inheritance",
      "Polymorphism",
      "Exception Handling",
    ],
  },
  {
    id: 4,
    title: "HTML",
    category: "Web Development",
    level: "Beginner",
    progress: 0,
    lessons: "0 / 8 lessons",
    next: "Introduction to HTML",
    duration: "3 weeks",
    lessonTopics: [
      "Introduction to HTML",
      "HTML Document Structure",
      "Headings and Paragraphs",
      "Links and Images",
      "Lists and Tables",
      "HTML Forms",
      "Semantic Elements",
      "HTML5 Overview",
    ],
  },
  {
    id: 5,
    title: "CSS",
    category: "Web Development",
    level: "Beginner",
    progress: 0,
    lessons: "0 / 8 lessons",
    next: "Introduction to CSS",
    duration: "4 weeks",
    lessonTopics: [
      "Introduction to CSS",
      "Selectors",
      "Colors and Backgrounds",
      "Box Model",
      "Typography",
      "Flexbox",
      "CSS Grid",
      "Responsive Web Design",
    ],
  },
  {
    id: 6,
    title: "JavaScript",
    category: "Web Development",
    level: "Beginner",
    progress: 0,
    lessons: "0 / 10 lessons",
    next: "Introduction to JavaScript",
    duration: "6 weeks",
    lessonTopics: [
      "Introduction to JavaScript",
      "Variables and Data Types",
      "Operators",
      "Conditional Statements",
      "Loops",
      "Functions",
      "Arrays and Objects",
      "DOM Manipulation",
      "Events",
      "Introduction to Async JavaScript",
    ],
  },
];
const courseCoverImages: Record<string, string> = {
  "C Programming": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85",
  "Python Programming": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85",
  "Java Programming": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85",
  HTML: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85",
  CSS: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=85",
  JavaScript: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85",
};

const courseVideos: Record<string, string> = {
  "C Programming": "https://www.youtube-nocookie.com/embed/aZb0iu4uGwA",
  "Python Programming":
    "https://www.youtube-nocookie.com/embed/7wnove7K-ZQ?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg",
  "Java Programming":
    "https://www.youtube-nocookie.com/embed/LBqE4YOvhyc?list=PLQEaRBV9gAFsR15tNo2QLF9d2qc-c018p",
  HTML: "https://www.youtube-nocookie.com/embed/k2DSi1zGEc8",
  CSS: "https://www.youtube-nocookie.com/embed/ESnrn1kAD4E",
  JavaScript: "https://www.youtube-nocookie.com/embed/VlPiVmYuoqw",
};
const weeklyActivity = [
  { day: "Mon", value: 48 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 64 },
  { day: "Sat", value: 96 },
  { day: "Sun", value: 42 },
];

const schedule = [
  {
    time: "09:00 AM",
    title: "C Programming",
    detail: "Pointers and Functions · Practice",
  },
  {
    time: "11:30 AM",
    title: "Python Programming",
    detail: "Lists and Dictionaries · Video lesson",
  },
  {
    time: "02:00 PM",
    title: "Java Programming",
    detail: "Object-Oriented Programming · Practice",
  },
  {
    time: "04:00 PM",
    title: "HTML",
    detail: "Semantic Elements and Forms · Video lesson",
  },
  {
    time: "05:00 PM",
    title: "CSS",
    detail: "Responsive Web Design · Project work",
  },
  {
    time: "06:00 PM",
    title: "JavaScript",
    detail: "Functions and DOM · Video lesson",
  },
];
type StudyTask = {
  id: number;
  title: string;
  completed: boolean;
};
const lessonMaterials: Record<
  string,
  {
    overview: string;
    notes: string[];
    example: string;
    practice: string[];
    quiz: string;
    answer: string;
  }
> = {
  "Introduction to C": {
    overview:
      "C is a general-purpose procedural programming language. It is widely used for learning programming fundamentals and developing system software.",
    notes: [
      "A C program is generally organized into functions.",
      "The main() function is the entry point of a hosted C program.",
      "#include <stdio.h> provides standard input/output functions such as printf().",
      "Most C statements end with a semicolon."
    ],
    example: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
    practice: [
      "Write a program to print your name.",
      "Print your name, age, and college on separate lines."
    ],
    quiz: "Which function is the usual entry point of a C program?",
    answer: "main()"
  },

  "Variables and Data Types": {
    overview:
      "Variables store values in memory. A data type specifies what kind of value a variable can hold.",
    notes: [
      "int stores integer values, such as 25.",
      "float stores decimal values, such as 3.14.",
      "char stores a single character, such as 'A'.",
      "Use meaningful variable names and declare variables before using them."
    ],
    example: `#include <stdio.h>

int main() {
    int age = 20;
    float marks = 85.5;
    char grade = 'A';

    printf("%d %.1f %c", age, marks, grade);
    return 0;
}`,
    practice: [
      "Declare variables for your age, percentage, and grade.",
      "Take two integers as input and print them."
    ],
    quiz: "Which format specifier is commonly used to print an int?",
    answer: "%d"
  },

  "Operators": {
    overview:
      "Operators perform calculations, comparisons, assignments, and logical operations on values.",
    notes: [
      "Arithmetic operators include +, -, *, /, and %.",
      "Relational operators compare values, such as ==, !=, >, and <.",
      "Logical operators are &&, ||, and !.",
      "The % operator gives the remainder of integer division."
    ],
    example: `#include <stdio.h>

int main() {
    int a = 17, b = 5;

    printf("Sum = %d\\n", a + b);
    printf("Remainder = %d", a % b);
    return 0;
}`,
    practice: [
      "Input two numbers and display their sum, difference, product, and quotient.",
      "Check whether a number is even using the % operator."
    ],
    quiz: "What is the result of 17 % 5?",
    answer: "2"
  },

  "Conditional Statements": {
    overview:
      "Conditional statements allow a program to choose different actions depending on whether a condition is true or false.",
    notes: [
      "if executes a block when its condition is true.",
      "else provides an alternative block.",
      "else if checks additional conditions.",
      "switch is useful when selecting among multiple constant cases."
    ],
    example: `#include <stdio.h>

int main() {
    int number;
    scanf("%d", &number);

    if (number % 2 == 0)
        printf("Even");
    else
        printf("Odd");

    return 0;
}`,
    practice: [
      "Check whether a number is positive, negative, or zero.",
      "Find the largest of three numbers using if-else."
    ],
    quiz: "Which statement provides an alternative when an if condition is false?",
    answer: "else"
  },

  "Loops": {
    overview:
      "Loops repeat a block of statements while a condition is satisfied or for a specified number of iterations.",
    notes: [
      "for is commonly used when the iteration count is known.",
      "while checks its condition before each iteration.",
      "do-while executes its body at least once.",
      "break exits a loop; continue skips to the next iteration."
    ],
    example: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    return 0;
}`,
    practice: [
      "Print numbers from 1 to 100.",
      "Find the sum of the first n natural numbers.",
      "Print the multiplication table of a given number."
    ],
    quiz: "Which loop executes its body at least once?",
    answer: "do-while"
  },

  "Arrays": {
    overview:
      "An array stores multiple values of the same data type in contiguous memory locations and accesses them using indices.",
    notes: [
      "Array indexing in C starts at 0.",
      "An array of 5 elements has indices 0 through 4.",
      "All elements in an ordinary array have the same data type.",
      "Accessing an index outside the array bounds causes undefined behavior."
    ],
    example: `#include <stdio.h>

int main() {
    int numbers[5] = {10, 20, 30, 40, 50};

    for (int i = 0; i < 5; i++) {
        printf("%d ", numbers[i]);
    }
    return 0;
}`,
    practice: [
      "Input 5 numbers into an array and calculate their sum.",
      "Find the largest element in an array.",
      "Search for a given value in an array."
    ],
    quiz: "What is the index of the first element of a C array?",
    answer: "0"
  },

  "Strings": {
    overview:
      "A C string is a character array terminated by the null character '\\0'.",
    notes: [
      "A string needs space for its characters and the terminating null character.",
      "The %s format specifier can read or print a string without spaces.",
      "Functions such as strlen(), strcpy(), and strcmp() are declared in string.h.",
      "Use a sufficiently large destination array when copying strings."
    ],
    example: `#include <stdio.h>
#include <string.h>

int main() {
    char name[] = "Riya";

    printf("Name: %s\\n", name);
    printf("Length: %zu", strlen(name));
    return 0;
}`,
    practice: [
      "Input a word and display its length.",
      "Compare two strings using strcmp().",
      "Count the vowels in a string."
    ],
    quiz: "Which character marks the end of a C string?",
    answer: "The null character, '\\0'."
  },

  "Functions": {
    overview:
      "A function is a reusable block of code that performs a specific task. Functions help organize programs and reduce repetition.",
    notes: [
      "A function can accept parameters and return a value.",
      "A function prototype declares its name, return type, and parameters.",
      "A void function does not return a value.",
      "C supports passing arguments by value; pointers can be used to modify caller data."
    ],
    example: `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    printf("%d", add(4, 6));
    return 0;
}`,
    practice: [
      "Write a function to find the maximum of two numbers.",
      "Write a function to calculate the square of a number.",
      "Write a function to check whether a number is prime."
    ],
    quiz: "Which keyword indicates that a function returns no value?",
    answer: "void"
  },

  "Pointers": {
    overview:
      "A pointer is a variable that stores the memory address of another object.",
    notes: [
      "The & operator obtains the address of a variable.",
      "The * operator declares a pointer and dereferences it.",
      "A pointer should point to a valid object before it is dereferenced.",
      "Pointers are used with arrays, functions, and dynamic memory."
    ],
    example: `#include <stdio.h>

int main() {
    int number = 25;
    int *ptr = &number;

    printf("Value = %d\\n", *ptr);
    printf("Address = %p", (void *)ptr);
    return 0;
}`,
    practice: [
      "Print a variable's value and address using a pointer.",
      "Swap two integers using pointers.",
      "Find the sum of two numbers using pointer parameters."
    ],
    quiz: "Which operator obtains the address of a variable?",
    answer: "&"
  },

  "Structures": {
    overview:
      "A structure groups related variables, possibly of different data types, under one user-defined type.",
    notes: [
      "Use the struct keyword to define a structure type.",
      "Use the dot operator to access a member through a structure variable.",
      "Use the arrow operator to access a member through a structure pointer.",
      "Structures are useful for records such as students, books, and employees."
    ],
    example: `#include <stdio.h>

struct Student {
    int roll;
    char grade;
};

int main() {
    struct Student s = {101, 'A'};

    printf("%d %c", s.roll, s.grade);
    return 0;
}`,
    practice: [
      "Create a Student structure with roll number, name, and marks.",
      "Input and display the details of three students.",
      "Find the student with the highest marks."
    ],
        quiz: "Which keyword is used to define a structure in C?",
    answer: "struct"
  }
};

const makeMaterial = (
  overview: string,
  notes: string[],
  example: string,
  practice: string[],
  quiz: string,
  answer: string
) => ({ overview, notes, example, practice, quiz, answer });

Object.assign(lessonMaterials, {
  // ================= PYTHON PROGRAMMING =================

  "Introduction to Python": makeMaterial(
    "Python is a high-level, general-purpose programming language known for readable syntax. It is used in automation, web development, data analysis, and scripting.",
    [
      "Python is dynamically typed: variable types are determined at runtime.",
      "Indentation defines code blocks.",
      "print() displays output and input() reads text from the user.",
      "Python statements generally do not require semicolons."
    ],
    `print("Hello, World!")
name = input("Enter your name: ")
print("Welcome", name)`,
    [
      "Print your name, department, and semester.",
      "Take two numbers as input and display their sum."
    ],
    "Which function displays output in Python?",
    "print()"
  ),

  "Variables and Data Types": makeMaterial(
    "Variables are names that refer to values. Python supports numeric, string, boolean, and collection data types.",
    [
      "int represents whole numbers; float represents decimal numbers.",
      "str stores text and bool stores True or False.",
      "Use type(value) to inspect a value's type.",
      "Variable names are case-sensitive and cannot begin with a digit."
    ],
    `name = "Asha"
age = 19
percentage = 82.5
is_student = True

print(type(age))
print(name, age, percentage, is_student)`,
    [
      "Create variables for your name, age, and marks.",
      "Convert a numeric string into an integer using int()."
    ],
    "Which data type stores True or False?",
    "bool"
  ),

  "Operators": makeMaterial(
    "Operators perform arithmetic, comparison, logical, assignment, and membership operations.",
    [
      "Arithmetic operators include +, -, *, /, //, %, and **.",
      "Comparison operators return True or False.",
      "and, or, and not are logical operators.",
      "in checks membership in sequences and collections."
    ],
    `a = 17
b = 5
print(a // b)  # 3
print(a % b)   # 2
print(a ** 2)  # 289`,
    [
      "Calculate the area of a rectangle using two variables.",
      "Check whether a number is divisible by both 3 and 5."
    ],
    "Which operator calculates the remainder?",
    "%"
  ),

  "Conditional Statements": makeMaterial(
    "Conditional statements execute different code blocks depending on Boolean conditions.",
    [
      "if tests the first condition.",
      "elif tests another condition when earlier conditions are false.",
      "else handles the remaining case.",
      "Indentation is required to define each block."
    ],
    `marks = int(input("Marks: "))

if marks >= 80:
    print("Grade A")
elif marks >= 60:
    print("Grade B")
else:
    print("Grade C")`,
    [
      "Check whether a number is positive, negative, or zero.",
      "Create a simple grading program using marks."
    ],
    "Which keyword checks another condition after if?",
    "elif"
  ),

  "Loops": makeMaterial(
    "Loops repeat instructions. Python provides for loops for iterables and while loops for condition-based repetition.",
    [
      "range(5) produces values 0 through 4.",
      "break terminates the nearest loop.",
      "continue skips the current iteration.",
      "A while loop must update its condition to avoid unintended infinite repetition."
    ],
    `for number in range(1, 6):
    print(number)

count = 3
while count > 0:
    print(count)
    count -= 1`,
    [
      "Print numbers from 1 to 100.",
      "Find the sum of the first n natural numbers.",
      "Print a multiplication table."
    ],
    "Which statement skips the current loop iteration?",
    "continue"
  ),

  "Lists and Tuples": makeMaterial(
    "Lists and tuples store ordered collections. Lists are mutable, while tuples are immutable.",
    [
      "List elements can be changed after creation.",
      "append() adds an item to a list.",
      "Tuple elements cannot be reassigned after tuple creation.",
      "Both support indexing and slicing."
    ],
    `marks = [70, 82, 91]
marks.append(88)
print(marks[0])
print(marks[1:3])

point = (10, 20)
print(point)`,
    [
      "Create a list of five numbers and find its maximum.",
      "Add and remove an item from a list.",
      "Create a tuple containing three city names."
    ],
    "Which collection is immutable: list or tuple?",
    "Tuple"
  ),

  "Dictionaries and Sets": makeMaterial(
    "Dictionaries store key-value pairs. Sets store unique elements and support mathematical set operations.",
    [
      "Dictionary values are accessed using keys.",
      "A dictionary key must be hashable.",
      "Sets automatically remove duplicate values.",
      "Use union, intersection, and difference to compare sets."
    ],
    `student = {"name": "Riya", "marks": 90}
print(student["name"])
student["marks"] = 95

a = {1, 2, 3}
b = {3, 4, 5}
print(a & b)`,
    [
      "Create a dictionary for a student with name, roll, and marks.",
      "Find common elements between two sets.",
      "Count word frequencies using a dictionary."
    ],
    "Which collection stores key-value pairs?",
    "Dictionary"
  ),

  "Functions": makeMaterial(
    "Functions are reusable blocks of code. They can accept parameters and return results.",
    [
      "Use def to define a function.",
      "Parameters appear in the function definition; arguments are supplied when calling it.",
      "return sends a result back to the caller.",
      "A function without an explicit return statement returns None."
    ],
    `def add(a, b):
    return a + b

result = add(4, 6)
print(result)`,
    [
      "Write a function to calculate the square of a number.",
      "Create a function that returns the largest of three values.",
      "Write a function to test whether a number is prime."
    ],
    "Which keyword defines a function in Python?",
    "def"
  ),

  "File Handling": makeMaterial(
    "File handling allows a program to read data from files and write data to files.",
    [
      "open() opens a file and returns a file object.",
      "Common modes include r for reading, w for writing, and a for appending.",
      "The with statement closes the file automatically.",
      "read(), readline(), and write() perform common file operations."
    ],
    `with open("notes.txt", "w") as file:
    file.write("Python file handling")

with open("notes.txt", "r") as file:
    content = file.read()
    print(content)`,
    [
      "Write three lines to a text file.",
      "Read a file and count its characters.",
      "Append a new line without deleting existing content."
    ],
    "Which file mode is used to append content?",
    "a"
  ),

  "Object-Oriented Programming": makeMaterial(
    "Object-oriented programming organizes code around classes and objects, combining data and related behavior.",
    [
      "A class defines a type; an object is an instance of a class.",
      "__init__ initializes a newly created instance.",
      "self refers to the current instance.",
      "Inheritance allows a class to derive behavior from another class."
    ],
    `class Student:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        print("I am", self.name)

student = Student("Riya")
student.introduce()`,
    [
      "Create a Book class with title and author attributes.",
      "Add a method that displays object details.",
      "Create a child class that inherits from a parent class."
    ],
    "Which keyword is used to define a class in Python?",
    "class"
  ),

  // ================= JAVA PROGRAMMING =================

  "Introduction to Java": makeMaterial(
    "Java is a class-based, object-oriented programming language. Java source code is compiled into bytecode that runs on the Java Virtual Machine.",
    [
      "The JDK includes tools for developing Java applications.",
      "The JVM executes Java bytecode.",
      "A Java application commonly starts from public static void main(String[] args).",
      "Java is statically typed, so variables have declared types."
    ],
    `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
    [
      "Print your name using System.out.println().",
      "Create a program that prints three lines of information."
    ],
    "Which runtime executes Java bytecode?",
    "JVM"
  ),

  "JAVA-Variables and Data Types": makeMaterial(
    "Java variables hold values of primitive types or references to objects.",
    [
      "Primitive types include int, double, char, boolean, byte, short, long, and float.",
      "String is a class, not a primitive type.",
      "Local variables must be initialized before use.",
      "Use meaningful names and choose suitable types."
    ],
    `public class Main {
    public static void main(String[] args) {
        int age = 20;
        double marks = 87.5;
        char grade = 'A';
        boolean passed = true;

        System.out.println(age);
        System.out.println(marks);
        System.out.println(grade);
        System.out.println(passed);
    }
}`,
    [
      "Declare variables for roll number, percentage, and grade.",
      "Convert an int to double and print both values."
    ],
    "Which Java primitive type stores true or false?",
    "boolean"
  ),

  "JAVA-Operators": makeMaterial(
    "Java operators perform arithmetic, comparison, logical, assignment, and other operations.",
    [
      "Arithmetic operators include +, -, *, /, and %.",
      "== compares primitive values; object equality may require equals().",
      "&& and || are short-circuit logical operators.",
      "Use parentheses to make complex expressions clear."
    ],
    `public class Main {
    public static void main(String[] args) {
        int a = 17, b = 5;
        System.out.println(a / b);
        System.out.println(a % b);
        System.out.println(a > b);
    }
}`,
    [
      "Calculate the area of a rectangle.",
      "Check whether an integer is even or odd.",
      "Compare two numbers and print the larger one."
    ],
    "What does the % operator return?",
    "The remainder"
  ),

  "JAVA-Conditional Statements": makeMaterial(
    "Conditional statements control which statements execute based on a Boolean condition.",
    [
      "if executes when its condition is true.",
      "else if checks additional conditions.",
      "else handles cases not matched above.",
      "switch selects among cases; break prevents fall-through where needed."
    ],
    `int marks = 75;

if (marks >= 80) {
    System.out.println("A");
} else if (marks >= 60) {
    System.out.println("B");
} else {
    System.out.println("C");
}`,
    [
      "Check whether a number is positive, negative, or zero.",
      "Build a grading program using if-else.",
      "Use switch to create a simple calculator."
    ],
    "What type of value does an if condition require?",
    "boolean"
  ),

  "JAVA-Loops": makeMaterial(
    "Loops repeat statements. Java provides for, while, and do-while loops.",
    [
      "for is useful when initialization, condition, and update are grouped.",
      "while checks the condition before each iteration.",
      "do-while executes its body at least once.",
      "break exits a loop and continue skips to the next iteration."
    ],
    `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`,
    [
      "Print numbers from 1 to 100.",
      "Calculate the sum of the first n natural numbers.",
      "Print a multiplication table."
    ],
    "Which loop executes its body at least once?",
    "do-while"
  ),

  "Arrays": makeMaterial(
    "An array stores a fixed number of values of one type, accessed using zero-based indices.",
    [
      "Array length is available through the length field.",
      "The first element is at index 0.",
      "An array's size is fixed after creation.",
      "Enhanced for loops can visit each element."
    ],
    `public class Main {
    public static void main(String[] args) {
        int[] values = {10, 20, 30};

        for (int value : values) {
            System.out.println(value);
        }
    }
}`,
    [
      "Find the sum and average of array elements.",
      "Find the largest value in an array.",
      "Search for a target value in an array."
    ],
    "What is the index of the first array element?",
    "0"
  ),

  "Classes and Objects": makeMaterial(
    "A class defines fields and methods. An object is an instance created from a class.",
    [
      "Fields represent object state.",
      "Methods define object behavior.",
      "Constructors initialize objects and have the same name as the class.",
      "new is commonly used to create an object."
    ],
    `class Student {
    String name;

    Student(String studentName) {
        name = studentName;
    }

    void display() {
        System.out.println(name);
    }
}

class Main {
    public static void main(String[] args) {
        Student s = new Student("Riya");
        s.display();
    }
}`,
    [
      "Create a Car class with brand and year fields.",
      "Add a constructor and a method to display details.",
      "Create two objects with different values."
    ],
    "Which keyword creates an object using a constructor?",
    "new"
  ),

  "Inheritance": makeMaterial(
    "Inheritance allows a subclass to reuse accessible members of a superclass and extend its behavior.",
    [
      "extends is used for class inheritance.",
      "Java classes support single inheritance from one direct superclass.",
      "A subclass can add fields and methods.",
      "super can refer to superclass constructors and members."
    ],
    `class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Bark");
    }
}`,
    [
      "Create a Vehicle superclass and a Car subclass.",
      "Add one method to the superclass and call it from a subclass object."
    ],
    "Which keyword is used for class inheritance in Java?",
    "extends"
  ),

  "Polymorphism": makeMaterial(
    "Polymorphism allows a common method or interface to represent different behaviors, such as method overloading and overriding.",
    [
      "Overloading uses the same method name with different parameter lists.",
      "Overriding provides a subclass implementation of an inherited instance method.",
      "Runtime overriding uses dynamic method dispatch.",
      "The @Override annotation helps the compiler check intended overrides."
    ],
    `class Animal {
    void sound() {
        System.out.println("Animal");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}`,
    [
      "Overload an add method for two and three integers.",
      "Override a display method in a subclass.",
      "Use a superclass reference to refer to a subclass object."
    ],
    "What is method overriding associated with?",
    "A subclass providing its own implementation of an inherited method"
  ),

  "Exception Handling": makeMaterial(
    "Exception handling manages runtime problems so a program can respond or recover instead of terminating unexpectedly.",
    [
      "try contains code that may throw an exception.",
      "catch handles a matching exception.",
      "finally is used for cleanup and normally executes whether or not an exception occurs.",
      "throw explicitly throws an exception; throws declares possible exceptions."
    ],
    `public class Main {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;
            System.out.println(result);
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero");
        }
    }
}`,
    [
      "Handle invalid integer input using an appropriate exception.",
      "Handle division by zero.",
      "Use finally to print a cleanup message."
    ],
    "Which block handles an exception?",
    "catch"
  ),

  // ================= HTML =================

  "Introduction to HTML": makeMaterial(
    "HTML (HyperText Markup Language) describes the structure and meaning of content on web pages.",
    [
      "HTML uses elements represented by tags.",
      "Many elements have opening and closing tags.",
      "Attributes provide additional information to elements.",
      "HTML structures content; CSS styles it and JavaScript adds behavior."
    ],
    `<!DOCTYPE html>
<html lang="en">
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, Web!</h1>
  <p>My first paragraph.</p>
</body>
</html>`,
    [
      "Create a page with a heading and two paragraphs.",
      "Add a title to the browser tab."
    ],
    "What does HTML stand for?",
    "HyperText Markup Language"
  ),

  "HTML Document Structure": makeMaterial(
    "A standard HTML document contains a doctype declaration, html root, head metadata, and body content.",
    [
      "<!DOCTYPE html> declares an HTML5 document.",
      "The head contains metadata, title, and linked resources.",
      "The body contains page content shown in the browser.",
      "Use lang on the html element to identify the document language."
    ],
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
</head>
<body>
  <main>
    <h1>Welcome</h1>
  </main>
</body>
</html>`,
    [
      "Create a complete HTML5 document.",
      "Add charset, viewport, and title metadata."
    ],
    "Which element contains the visible page content?",
    "body"
  ),

  "Headings and Paragraphs": makeMaterial(
    "Headings establish document hierarchy, while paragraphs group blocks of text.",
    [
      "HTML provides six heading levels, h1 through h6.",
      "Use headings in a logical hierarchy rather than choosing them only for size.",
      "The p element represents a paragraph.",
      "Use br for a line break only when the break is meaningful."
    ],
    `<h1>Course Notes</h1>
<h2>Introduction</h2>
<p>HTML structures web content.</p>
<h2>Topics</h2>
<p>We will learn headings and paragraphs.</p>`,
    [
      "Create a page with one h1 and three h2 headings.",
      "Write a paragraph under each section."
    ],
    "How many heading levels does HTML provide?",
    "Six (h1 to h6)"
  ),

  "Links and Images": makeMaterial(
    "Links navigate to other resources. Images embed visual content and should have meaningful alternative text when informative.",
    [
      "Use the a element with href to create a link.",
      "Use img with src to reference an image.",
      "The alt attribute provides alternative text.",
      "Use descriptive link text instead of vague text such as 'click here'."
    ],
    `<a href="https://example.com">Visit Example</a>

<img src="photo.jpg" alt="A mountain landscape" width="400">`,
    [
      "Create a link to another web page.",
      "Display an image with descriptive alt text.",
      "Make an image clickable by placing it inside a link."
    ],
    "Which attribute specifies an image file location?",
    "src"
  ),

  "Lists and Tables": makeMaterial(
    "HTML lists organize related items. Tables present data arranged in rows and columns.",
    [
      "ul creates an unordered list; ol creates an ordered list.",
      "li represents a list item.",
      "table contains tabular data; tr defines a row.",
      "th defines a header cell and td defines a data cell."
    ],
    `<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>

<table>
  <tr><th>Name</th><th>Marks</th></tr>
  <tr><td>Riya</td><td>90</td></tr>
</table>`,
    [
      "Create an ordered list of five study tasks.",
      "Create a table with three students and their marks.",
      "Add header cells to the table."
    ],
    "Which element represents a table row?",
    "tr"
  ),

  "HTML Forms": makeMaterial(
    "Forms collect user input through controls such as text fields, radio buttons, checkboxes, and submit buttons.",
    [
      "The form element groups controls for submission.",
      "The name attribute identifies submitted form data.",
      "label associates descriptive text with a control.",
      "Use suitable input types and required for basic browser validation."
    ],
    `<form action="/submit" method="post">
  <label for="email">Email:</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">Submit</button>
</form>`,
    [
      "Create a form with name, email, and password fields.",
      "Add a radio group for selecting a course.",
      "Use required on mandatory fields."
    ],
    "Which attribute names a form control's submitted value?",
    "name"
  ),

  "Semantic Elements": makeMaterial(
    "Semantic HTML elements communicate the purpose of content to browsers, developers, and assistive technologies.",
    [
      "header represents introductory content for a page or section.",
      "nav contains major navigation links.",
      "main identifies the page's primary content.",
      "article, section, and footer describe meaningful content regions."
    ],
    `<header><h1>My Blog</h1></header>
<nav><a href="/">Home</a></nav>
<main>
  <article>
    <h2>First Post</h2>
    <p>Article content.</p>
  </article>
</main>
<footer>Copyright 2026</footer>`,
    [
      "Build a page layout using header, nav, main, and footer.",
      "Place a blog post inside an article element."
    ],
    "Which semantic element identifies the main page content?",
    "main"
  ),

  "HTML5 Overview": makeMaterial(
    "HTML5 introduced modern document features and native elements for media, graphics, forms, and semantic page structure.",
    [
      "HTML5 supports audio and video elements.",
      "Canvas provides a drawing surface controlled by scripting.",
      "New input types include email, date, and number.",
      "Semantic elements improve document meaning and structure."
    ],
    `<video controls width="400">
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support video.
</video>

<input type="date">
<input type="email" placeholder="Email">`,
    [
      "Add an audio element with controls.",
      "Create a form using email and date input types.",
      "Use semantic HTML5 elements in a page."
    ],
    "Which HTML element embeds video content?",
    "video"
  ),

  // ================= CSS =================

  "Introduction to CSS": makeMaterial(
    "CSS (Cascading Style Sheets) controls the presentation of HTML, including colors, spacing, layout, and typography.",
    [
      "CSS rules contain selectors and declaration blocks.",
      "A declaration consists of a property and value.",
      "CSS can be added inline, internally, or through an external stylesheet.",
      "External stylesheets support reuse across multiple pages."
    ],
    `/* styles.css */
h1 {
  color: purple;
  text-align: center;
}

p {
  font-size: 16px;
}`,
    [
      "Change a heading's color and alignment.",
      "Link an external CSS file to an HTML page."
    ],
    "What does CSS stand for?",
    "Cascading Style Sheets"
  ),

  "Selectors": makeMaterial(
    "CSS selectors identify which HTML elements receive a set of style declarations.",
    [
      "Element selectors target tags such as p or h1.",
      "Class selectors begin with a dot, such as .card.",
      "ID selectors begin with #, such as #header.",
      "Descendant and pseudo-class selectors target relationships and states."
    ],
    `p {
  color: navy;
}

.card {
  padding: 16px;
}

#main-title {
  font-size: 2rem;
}

a:hover {
  text-decoration: underline;
}`,
    [
      "Style all paragraphs using an element selector.",
      "Create a reusable card class.",
      "Apply a hover style to links."
    ],
    "Which symbol begins a class selector?",
    "."
  ),

  "Colors and Backgrounds": makeMaterial(
    "CSS color and background properties control text color, element backgrounds, images, and related visual effects.",
    [
      "Colors can be written as names, hex values, rgb(), or hsl().",
      "background-color sets a solid background color.",
      "background-image can display an image or gradient.",
      "Use sufficient contrast so text remains readable."
    ],
    `.banner {
  color: #ffffff;
  background-color: #4f46e5;
  background-image: linear-gradient(90deg, #4f46e5, #9333ea);
  padding: 24px;
}`,
    [
      "Create a colored banner with readable text.",
      "Apply a linear gradient to a section.",
      "Experiment with hex and rgb color values."
    ],
    "Which property sets an element's background color?",
    "background-color"
  ),

  "Box Model": makeMaterial(
    "The CSS box model describes how content, padding, border, and margin determine an element's size and spacing.",
    [
      "Content is the innermost area.",
      "Padding is space between content and border.",
      "Border surrounds padding and content.",
      "Margin creates space outside the border; box-sizing changes sizing calculations."
    ],
    `* {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 20px;
  border: 2px solid #888;
  margin: 16px;
}`,
    [
      "Create a card with padding, border, and margin.",
      "Compare content-box and border-box sizing.",
      "Use browser developer tools to inspect box dimensions."
    ],
    "Which box-model property creates space outside the border?",
    "margin"
  ),

  "Typography": makeMaterial(
    "CSS typography controls how text appears through font families, size, weight, line height, alignment, and spacing.",
    [
      "font-family selects typefaces and fallback fonts.",
      "font-size controls text size.",
      "font-weight controls the thickness of text.",
      "line-height adjusts spacing between lines."
    ],
    `body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}`,
    [
      "Choose a readable font family for a page.",
      "Set different sizes for h1 and paragraphs.",
      "Adjust line-height for comfortable reading."
    ],
    "Which CSS property controls space between lines of text?",
    "line-height"
  ),

  "Flexbox": makeMaterial(
    "Flexbox is a one-dimensional layout system for arranging items along a row or column.",
    [
      "display: flex creates a flex container.",
      "justify-content distributes items along the main axis.",
      "align-items aligns items along the cross axis.",
      "flex-wrap allows items to wrap onto additional lines."
    ],
    `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}`,
    [
      "Arrange three cards in a row using Flexbox.",
      "Center an item horizontally and vertically.",
      "Make a navigation bar wrap on narrow screens."
    ],
    "Which property aligns flex items along the cross axis?",
    "align-items"
  ),

  "CSS Grid": makeMaterial(
    "CSS Grid is a two-dimensional layout system for arranging items in rows and columns.",
    [
      "display: grid creates a grid container.",
      "grid-template-columns defines column tracks.",
      "gap sets spacing between grid items.",
      "fr represents a fraction of available space."
    ],
    `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  padding: 20px;
}`,
    [
      "Create a three-column card layout.",
      "Use repeat() and minmax() for flexible columns.",
      "Make a card span two columns."
    ],
    "Which property defines grid columns?",
    "grid-template-columns"
  ),

  "Responsive Web Design": makeMaterial(
    "Responsive design adapts page layout to different screen sizes and devices.",
    [
      "Use the viewport meta tag in HTML.",
      "Fluid widths and flexible layouts adapt to available space.",
      "Media queries apply styles at selected viewport conditions.",
      "Test layouts at narrow and wide widths."
    ],
    `/* Default: small screens */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 700px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}`,
    [
      "Make a card layout switch from one to two columns.",
      "Use max-width to prevent text from becoming too wide.",
      "Test the page using browser responsive mode."
    ],
    "Which CSS feature applies styles based on viewport conditions?",
    "Media queries"
  ),

  // ================= JAVASCRIPT =================

  "Introduction to JavaScript": makeMaterial(
    "JavaScript is a programming language used to add behavior and interactivity to web pages, and it also runs in server-side environments.",
    [
      "JavaScript can respond to user events.",
      "It can update HTML content and CSS styles through the DOM.",
      "JavaScript is dynamically typed.",
      "Use the browser console to inspect output and errors."
    ],
    `const heading = document.querySelector("h1");
console.log("Page loaded");

if (heading) {
  heading.textContent = "Hello, JavaScript!";
}`,
    [
      "Print a message using console.log().",
      "Change a heading's text using JavaScript.",
      "Link an external JavaScript file to HTML."
    ],
    "Which function prints a message to the browser console?",
    "console.log()"
  ),

  "JAVASCRIPT-Variables and Data Types": makeMaterial(
    "Variables bind names to values. JavaScript includes primitive types and objects.",
    [
      "Use const for bindings that will not be reassigned.",
      "Use let when reassignment is needed; avoid var in modern code unless required.",
      "Primitive types include string, number, boolean, null, undefined, bigint, and symbol.",
      "typeof can inspect many value types."
    ],
    `const name = "Riya";
let age = 20;
const isStudent = true;

age = age + 1;
console.log(name, age, isStudent);
console.log(typeof age);`,
    [
      "Declare variables for name, age, and marks.",
      "Use typeof to inspect several values.",
      "Update a let variable and print its new value."
    ],
    "Which keyword declares a block-scoped variable that can be reassigned?",
    "let"
  ),

  "JAVASCRIPT-Operators": makeMaterial(
    "JavaScript operators perform arithmetic, comparisons, logical operations, assignments, and type-related checks.",
    [
      "Arithmetic operators include +, -, *, /, %, and **.",
      "=== checks strict equality without type coercion.",
      "&&, ||, and ! are logical operators.",
      "Use parentheses to clarify evaluation order."
    ],
    `const a = 17;
const b = 5;

console.log(a % b);
console.log(a ** 2);
console.log(a === "17");`,
    [
      "Calculate the area of a rectangle.",
      "Check whether a number is divisible by 2.",
      "Compare values using == and === and observe the difference."
    ],
    "Which operator checks strict equality?",
    "==="
  ),

  "JAVASCRIPT-Conditional Statements": makeMaterial(
    "Conditional statements execute code according to Boolean expressions.",
    [
      "if executes a block when its condition is truthy.",
      "else if checks another condition.",
      "else handles the remaining branch.",
      "switch is useful for matching one expression against multiple cases."
    ],
    `const marks = 76;

if (marks >= 80) {
  console.log("A");
} else if (marks >= 60) {
  console.log("B");
} else {
  console.log("C");
}`,
    [
      "Check whether a number is positive, negative, or zero.",
      "Create a marks-to-grade program.",
      "Use switch to display a weekday name."
    ],
    "Which keyword provides the final alternative branch?",
    "else"
  ),

  "JAVASCRIPT-Loops": makeMaterial(
    "Loops repeat code. JavaScript provides for, while, do-while, for...of, and for...in loops.",
    [
      "for is useful when a counter controls repetition.",
      "while repeats while a condition remains true.",
      "do-while executes the body at least once.",
      "for...of iterates over iterable values such as array elements."
    ],
    `for (let i = 1; i <= 5; i++) {
  console.log(i);
}

const colors = ["red", "blue"];
for (const color of colors) {
  console.log(color);
}`,
    [
      "Print numbers from 1 to 100.",
      "Calculate the sum of an array's values.",
      "Print a multiplication table."
    ],
    "Which loop is designed to iterate over iterable values?",
    "for...of"
  ),

  "JAVASCRIPT-Functions": makeMaterial(
    "Functions package reusable instructions. They can accept arguments, return values, and be assigned to variables.",
    [
      "Function declarations use the function keyword.",
      "Arrow functions provide a concise function syntax.",
      "return sends a result to the caller.",
      "Parameters are local names for values supplied as arguments."
    ],
    `function add(a, b) {
  return a + b;
}

const multiply = (a, b) => a * b;

console.log(add(3, 4));
console.log(multiply(3, 4));`,
    [
      "Write a function to calculate a square.",
      "Create a function that returns the largest of two numbers.",
      "Rewrite a function declaration as an arrow function."
    ],
    "Which keyword sends a value back from a function?",
    "return"
  ),

  "Arrays and Objects": makeMaterial(
    "Arrays store ordered collections. Objects store related data as key-value properties.",
    [
      "Array indices start at zero.",
      "push() adds an item to the end of an array.",
      "Object properties can be accessed using dot or bracket notation.",
      "Use map() to transform arrays and filter() to select matching items."
    ],
    `const numbers = [2, 4, 6];
numbers.push(8);
const doubled = numbers.map(n => n * 2);

const student = { name: "Riya", marks: 90 };
console.log(doubled);
console.log(student.name);`,
    [
      "Find the largest number in an array.",
      "Use map() to double every array value.",
      "Create a student object and display its properties."
    ],
    "Which method adds an item to the end of an array?",
    "push()"
  ),

  "DOM Manipulation": makeMaterial(
    "The Document Object Model represents a web page as a tree of objects that JavaScript can inspect and modify.",
    [
      "document.querySelector() selects the first matching element.",
      "textContent changes an element's text.",
      "classList.add() and classList.remove() modify CSS classes.",
      "Check that an element exists before accessing its properties."
    ],
    `const title = document.querySelector("#title");

if (title) {
  title.textContent = "Updated heading";
  title.classList.add("highlight");
}`,
    [
      "Change a paragraph's text after a button click.",
      "Add and remove a CSS class from an element.",
      "Create a list item and append it to a list."
    ],
    "Which method selects the first matching CSS selector?",
    "document.querySelector()"
  ),

  "Events": makeMaterial(
    "Events represent actions or occurrences such as clicks, keyboard input, form submission, and page loading.",
    [
      "addEventListener() registers an event handler.",
      "The event object provides information about the event.",
      "Use preventDefault() to prevent a browser's default action when appropriate.",
      "Avoid assigning multiple handlers through repeated inline event properties."
    ],
    `const button = document.querySelector("#myButton");

button?.addEventListener("click", () => {
  console.log("Button clicked");
});`,
    [
      "Show an alert when a button is clicked.",
      "Update a paragraph when a user types in an input.",
      "Prevent a form's default submission and display its values."
    ],
    "Which method registers an event listener?",
    "addEventListener()"
  ),

  "Introduction to Async JavaScript": makeMaterial(
    "Asynchronous JavaScript handles operations that complete later, such as network requests and timers, without blocking ordinary execution.",
    [
      "A Promise represents a future completion or failure.",
      "async functions always return a Promise.",
      "await pauses an async function until a Promise settles.",
      "Use try/catch to handle errors from awaited operations."
    ],
    `async function loadData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}`,
    [
      "Create a Promise that resolves after a short delay.",
      "Write an async function that awaits a Promise.",
      "Handle a rejected Promise using try/catch."
    ],
    "Which keyword is used to wait for a Promise inside an async function?",
    "await"
    )
});

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentUserName, setCurrentUserName] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<(typeof courses)[number] | null>(null);
  const [isLight, setIsLight] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileFullName, setProfileFullName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [confirmRecoveryPassword, setConfirmRecoveryPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  
const showToast = (
  message: string,
  type: "success" | "error" = "success"
) => {
  setToastType(type);
  setToastMessage(message);
};

  const [toastType, setToastType] = useState<"success" | "error">("success");
  useEffect(() => {
  if (!toastMessage) return;

  const timeout = setTimeout(() => {
    setToastMessage("");
  }, 2000);

  return () => clearTimeout(timeout);
}, [toastMessage]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  type ChatSession = {
  id: string;
  title: string;
  messages: { role: "user" | "assistant"; content: string }[];
};

const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
const [currentChatId, setCurrentChatId] = useState<string | null>(null);
const [historyReady, setHistoryReady] = useState(false);
useEffect(() => {
  try {
    const savedHistory = localStorage.getItem("edusphere-chat-history");

    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  } catch (error) {
    console.error("Could not load chat history:", error);
  } finally {
    setHistoryReady(true);
  }
}, []);

useEffect(() => {
  if (!historyReady) return;

  try {
    localStorage.setItem(
      "edusphere-chat-history",
      JSON.stringify(chatHistory)
    );
  } catch (error) {
    console.error("Could not save chat history:", error);
  }
}, [chatHistory, historyReady]);



useEffect(() => {
  let mounted = true;

  const initialUrl = new URL(window.location.href);
  
const isRecoveryLink =
  initialUrl.searchParams.get("type") === "recovery" ||
  initialUrl.hash.includes("type=recovery") ||
  initialUrl.searchParams.has("token_hash") ||
  initialUrl.searchParams.has("code") ||
  new URLSearchParams(initialUrl.hash.replace(/^#/, "")).get("type") === "recovery";

if (isRecoveryLink) {
  setIsPasswordRecovery(true);
}

  let handlingSignupConfirmation =
    initialUrl.searchParams.get("type") === "signup" &&
    !!initialUrl.searchParams.get("token_hash");

  if (handlingSignupConfirmation) setAuthChecking(true);
  if (isRecoveryLink) {
  setAuthChecking(true);
}

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (event, session) => {
  if (!mounted || handlingSignupConfirmation || isRecoveryLink) return;

  if (event === "PASSWORD_RECOVERY") {
    setIsPasswordRecovery(true);
    setIsLoggedIn(false);
    return;
  }

  setIsLoggedIn(!!session);

  if (session) {
    const metadataName = session.user.user_metadata?.full_name;

    setCurrentUserName(
      typeof metadataName === "string"
        ? metadataName
        : session.user.email ?? ""
    );

    setLoginEmail(session.user.email ?? "");
  } else {
    setCurrentUserName("");
  }
}
);

  const loadSession = async () => {
    try {
      if (handlingSignupConfirmation) {
        const tokenHash = initialUrl.searchParams.get("token_hash");

        window.history.replaceState(
          {},
          document.title,
          initialUrl.pathname
        );

        if (!tokenHash) {
          throw new Error("Email verification link is invalid.");
        }

        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "email",
        });

        if (verifyError) {
          handlingSignupConfirmation = false;
          setIsLoggedIn(false);
          showToast(verifyError.message, "error");
          return;
        }

        const { error: signOutError } = await supabase.auth.signOut();

        handlingSignupConfirmation = false;

        if (signOutError) {
          setIsLoggedIn(false);
          showToast(
            "Email verified, but session cleanup failed. Please try again.",
            "error"
          );
          return;
        }

        setIsLoggedIn(false);
        setCurrentUserName("");
        setLoginEmail("");
        setLoginPassword("");
        setShowSignup(false);

        showToast("Email verified! Please sign in.", "success");
        return;
      }

      

      
if (isRecoveryLink) {
  const tokenHash = initialUrl.searchParams.get("token_hash");
  const code = initialUrl.searchParams.get("code");
  const hashParams = new URLSearchParams(
    initialUrl.hash.replace(/^#/, "")
  );

  if (tokenHash) {
    const { error: recoveryError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (recoveryError) throw recoveryError;
  } else if (code) {
    const { error: recoveryError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (recoveryError) throw recoveryError;
  } else if (
    hashParams.has("access_token") &&
    hashParams.has("refresh_token")
  ) {
    const { error: recoveryError } = await supabase.auth.setSession({
      access_token: hashParams.get("access_token")!,
      refresh_token: hashParams.get("refresh_token")!,
    });

    if (recoveryError) throw recoveryError;
  }

  const { data: recoverySession, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  if (!recoverySession.session) {
    throw new Error(
      "Password reset link is invalid or expired. Request a new link."
    );
  }

  if (!mounted) return;

  setIsPasswordRecovery(true);
  setIsLoggedIn(false);

  window.history.replaceState(
    {},
    document.title,
    initialUrl.pathname
  );

  return;
}

      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;
      if (!mounted) return;

      const session = data.session;

      setIsLoggedIn(!!session);

      if (session) {
        const metadataName = session.user.user_metadata?.full_name;

        setCurrentUserName(
          typeof metadataName === "string"
            ? metadataName
            : session.user.email ?? ""
        );

        setLoginEmail(session.user.email ?? "");
      } else {
        setCurrentUserName("");
      }
    } catch (error) {
      handlingSignupConfirmation = false;
      console.error("Could not initialize authentication:", error);

      if (mounted) {
        setIsLoggedIn(false);
        setCurrentUserName("");
        showToast(
          error instanceof Error
            ? error.message
            : "Authentication failed. Please try again.",
          "error"
        );
      }
    } finally {
      if (mounted) setAuthChecking(false);
    }
  };

  void loadSession();

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);



const [chatMessages, setChatMessages] = useState<
  { role: "user" | "assistant"; content: string }[]
>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const lessonContentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
  if (selectedLesson) {
    lessonContentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [selectedLesson]);
  const [completedLessons, setCompletedLessons] = useState<Record<number, string[]>>({});
  const [progressReady, setProgressReady] = useState(false);
  useEffect(() => {
  try {
    const savedProgress = localStorage.getItem("edusphere-completed-lessons");

    if (savedProgress) {
      setCompletedLessons(JSON.parse(savedProgress));
    }
  } catch (error) {
    console.error("Could not load saved progress:", error);
  } finally {
    setProgressReady(true);
  }
}, []);

useEffect(() => {
  if (!progressReady) return;

  try {
    localStorage.setItem(
      "edusphere-completed-lessons",
      JSON.stringify(completedLessons)
    );
  } catch (error) {
    console.error("Could not save progress:", error);
  }
}, [completedLessons, progressReady]);

function getCourseProgress(course: (typeof courses)[number]) {
  const completed = completedLessons[course.id]?.length ?? 0;
  return Math.round((completed / course.lessonTopics.length) * 100);
}

async function sendChatMessage() {
  const message = chatInput.trim();

  if (!message || isChatLoading) return;
  const isNewChat = chatMessages.length === 0;
const chatId = currentChatId ?? crypto.randomUUID();

if (isNewChat) {
  setCurrentChatId(chatId);

  setChatHistory((current) => [
    ...current,
    {
      id: chatId,
      title: message,
      messages: [],
    },
  ]);
}

  setIsChatLoading(true);

  setChatMessages((current) => [
    ...current,
    { role: "user", content: message },
  ]);
  setChatHistory((current) =>
  current.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          messages: [
            ...chat.messages,
            { role: "user", content: message },
          ],
        }
      : chat
  )
);

  setChatInput("");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to get a response.");
    }

    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: data.reply,
      },
    ]);
    setChatHistory((current) =>
  current.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          messages: [
            ...chat.messages,
            { role: "assistant", content: data.reply },
          ],
        }
      : chat
  )
);
  } catch (error) {
    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "The assistant is temporarily unavailable. Please try again.",
      },
    ]);
  } finally {
    setIsChatLoading(false);
  }
}

function completeLesson(course: (typeof courses)[number], lesson: string) {
  setCompletedLessons((previous) => {
    const alreadyCompleted = previous[course.id] ?? [];

    if (alreadyCompleted.includes(lesson)) {
      return previous;
    }

    return {
      ...previous,
      [course.id]: [...alreadyCompleted, lesson],
    };
  });
}

const selectedLessonIndex =
  selectedCourse && selectedLesson
    ? selectedCourse.lessonTopics.indexOf(selectedLesson)
    : -1;

const materialKey =
  selectedCourse?.title === "Python Programming" &&
  selectedLesson &&
  lessonMaterials[`PYTHON-${selectedLesson}`]
    ? `PYTHON-${selectedLesson}`
    : selectedCourse?.title === "Java Programming" &&
        selectedLesson &&
        lessonMaterials[`JAVA-${selectedLesson}`]
      ? `JAVA-${selectedLesson}`
      : selectedCourse?.title === "JavaScript" &&
          selectedLesson &&
          lessonMaterials[`JAVASCRIPT-${selectedLesson}`]
        ? `JAVASCRIPT-${selectedLesson}`
        : selectedLesson ?? "";

const selectedMaterial = selectedLesson
  ? lessonMaterials[materialKey]
  : undefined;
  useEffect(() => {
    const savedTasks = localStorage.getItem("edusphere-tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        setTasks([]);
        useEffect(() => {
  const savedChat = localStorage.getItem("edusphere-chat");

  if (savedChat) {
    try {
      setChatMessages(JSON.parse(savedChat));
    } catch {
      setChatMessages([]);
    }
  }
}, []);

useEffect(() => {
  localStorage.setItem("edusphere-chat", JSON.stringify(chatMessages));
}, [chatMessages]);
      }
    }

    const savedTheme = localStorage.getItem("edusphere-theme");
    if (savedTheme === "light") setIsLight(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("edusphere-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("edusphere-theme", isLight ? "light" : "dark");
  }, [isLight]);

  const visibleCourses = courses.filter((course) => {
  const query = searchQuery.trim().toLowerCase();

  if (!query) return true;

  return (
    course.title.toLowerCase().includes(query) ||
    course.category.toLowerCase().includes(query) ||
    course.level.toLowerCase().includes(query) ||
    course.lessonTopics.some((topic) =>
      topic.toLowerCase().includes(query)
    )
  );
});

  const completedTasks = tasks.filter((task) => task.completed).length;

  const cardStyle = isLight
    ? "border-slate-200 bg-white shadow-sm"
    : "border-white/[0.08] bg-[#191927]";

  const mutedText = isLight ? "text-slate-500" : "text-slate-400";

  const pageText = isLight ? "text-slate-900" : "text-white";

  const pageBackground = isLight ? "bg-slate-100" : "bg-[#10101b]";

  function navigateTo(section: string) {
    setActiveNav(section);
    setSelectedCourse(null);
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        completed: false,
      },
    ]);

    setNewTask("");
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function openCourse(course: (typeof courses)[number]) {
  setSelectedCourse(course);
  setActiveNav("My Courses");
}
useEffect(() => {
  const loadProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, phone, avatar_url")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (error) {
      showToast("Unable to load your profile.", "error");
      return;
    }

    if (data) {
  setProfileFullName(data.full_name ?? "");
  setProfilePhone(data.phone ?? "");
  setAvatarUrl(data.avatar_url ?? "");
}
  };

  loadProfile();
}, []);
const handleProfileSave = async () => {
  setProfileLoading(true);

  try {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      showToast("Unable to verify your account.", "error");
      return;
    }
 console.log("Phone value before saving:", profilePhone);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userData.user.id,
          full_name: profileFullName.trim(),
          phone: profilePhone.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      showToast(error.message, "error");
      return;
    }
    setCurrentUserName(profileFullName.trim());

    const { error: authUpdateError } = await supabase.auth.updateUser({
  data: {
    full_name: profileFullName.trim(),
  },
});

if (authUpdateError) {
  showToast("Profile saved, but account name update failed.", "error");
  return;
}

    showToast("Profile saved successfully.", "success");
  } catch {
    showToast("Something went wrong while saving your profile.", "error");
  } finally {
    setProfileLoading(false);
  }
};


const handleForgotPassword = async () => {
  const email = resetEmail.trim();

  if (!email) {
    showToast("Please enter your email address.", "error");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/?type=recovery`,
});

  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("Password reset link sent! Check your email.", "success");
  setShowForgotPassword(false);
  setResetEmail("");
};


const handleRecoveryPasswordUpdate = async () => {
  if (!recoveryPassword || !confirmRecoveryPassword) {
    showToast("Please fill in both password fields.", "error");
    return;
  }

  if (recoveryPassword !== confirmRecoveryPassword) {
    showToast("Passwords do not match.", "error");
    return;
  }

  if (recoveryPassword.length < 8) {
    showToast("Password must be at least 8 characters.", "error");
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password: recoveryPassword,
  });

  if (error) {
    showToast(error.message, "error");
    return;
  }

  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    showToast(
      "Password changed, but sign out failed. Please sign in again.",
      "error"
    );
    return;
  }

  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );

  setRecoveryPassword("");
  setConfirmRecoveryPassword("");
  setIsPasswordRecovery(false);
  setIsLoggedIn(false);
  setLoginPassword("");

  showToast(
    "Password changed successfully. Please sign in.",
    "success"
  );
};


const handlePasswordChange = async () => {
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    showToast("Please fill in all password fields.", "error");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    showToast("New password and confirm password do not match.", "error");
    return;
  }

  if (newPassword.length < 8) {
    showToast("New password must be at least 8 characters long.", "error");
    return;
  }

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user?.email) {
    showToast("Unable to verify your account.", "error");
    return;
  }

  const { error: verifyError } =
    await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: currentPassword,
    });

  if (verifyError) {
    showToast("Current password is incorrect.", "error");
    return;
  }

  const { error: updateError } =
    await supabase.auth.updateUser({
      password: newPassword,
    });

  if (updateError) {
    showToast(updateError.message, "error");
    return;
  }

  setCurrentPassword("");
  setNewPassword("");
  setConfirmNewPassword("");

  showToast("Password changed successfully.", "success");
};

if (authChecking || !isLoggedIn) {
  return (
    <main
  className={`relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-8 transition-colors duration-500 ${
    isLight ? "bg-slate-100 text-slate-900" : "bg-[#070914] text-white"
  }`}
>
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center transition-all duration-700"
    style={{
      backgroundImage:
  "url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2400&q=90')",
backgroundPosition: "center",
backgroundSize: "cover",
opacity: 1,
filter: isLight ? "saturate(1)" : "saturate(1.2)",
    }}
  />

  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 -z-10 transition-all duration-700 ${
      isLight
  ? "bg-transparent"
  : "bg-gradient-to-br from-[#080b1b]/65 via-[#11102b]/35 to-violet-950/55"
    }`}
  />

  <div
    aria-hidden="true"
    className={`pointer-events-none absolute -left-32 top-1/4 -z-10 h-96 w-96 rounded-full blur-[120px] transition-all duration-700 ${
      isLight ? "bg-violet-300/20" : "bg-violet-500/35"
    }`}
  />

  <div
    aria-hidden="true"
    className={`pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full blur-[120px] transition-all duration-700 ${
      isLight ? "bg-blue-300/20" : "bg-blue-500/35"
    }`}
  />
    {toastMessage && (
  <div
    className={`fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
      toastType === "success"
        ? "border-emerald-500/20 bg-[#191927] text-emerald-400"
        : "border-red-500/20 bg-[#191927] text-red-400"
    }`}
  >
    <span className="text-lg">
      {toastType === "success" ? "✓" : "!"}
    </span>
    <p className="text-sm font-medium">{toastMessage}</p>
  </div>
)}

      
        {isPasswordRecovery ? (
  <div className="flex w-full items-center justify-center">
  <div className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-md transition-all duration-500 ${
  isLight
    ? "border-white/25 bg-white/10 shadow-slate-900/10"
    : "border-white/15 bg-[#101322]/10 shadow-black/20"
}`}>
    <h1 className="text-2xl font-bold">Reset Password</h1>
    <p className={`mt-2 text-sm ${mutedText}`}>
      Enter and confirm your new password.
    </p>

    <div className="mt-6 space-y-4">
      <input
        type="password"
        placeholder="New Password"
        value={recoveryPassword}
        onChange={(event) => setRecoveryPassword(event.target.value)}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
          isLight
            ? "border-slate-200 bg-slate-50"
            : "border-white/10 bg-white/5"
        }`}
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmRecoveryPassword}
        onChange={(event) => setConfirmRecoveryPassword(event.target.value)}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
          isLight
            ? "border-slate-200 bg-slate-50"
            : "border-white/10 bg-white/5"
        }`}
      />

      <button
        type="button"
        onClick={handleRecoveryPasswordUpdate}
        className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
      >
        Change Password
      </button>
    </div>
  </div>
</div>
) : (
        <div
  className={`relative mx-auto w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-md transition-all duration-500 ${
  isLight
    ? "border-white/25 bg-white/10 shadow-slate-900/10"
    : "border-white/15 bg-[#101322]/10 shadow-black/20"
}`}
>
          {showVerificationMessage && (
  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-black/40 p-6 backdrop-blur-sm">
    <div
      className={`w-full rounded-2xl border p-6 text-center shadow-2xl ${
        isLight
          ? "border-slate-200 bg-white"
          : "border-white/10 bg-[#191927]"
      }`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
        <span className="text-2xl">✓</span>
      </div>

      <h2 className="mt-5 text-xl font-bold">
        Account Created Successfully
      </h2>

      <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
        We’ve sent a verification link to your email address.
        <br />
        Please check your mailbox and confirm your email to continue.
      </p>

      <div
        className={`mt-5 rounded-xl border p-4 text-sm ${
          isLight
            ? "border-violet-100 bg-violet-50 text-slate-700"
            : "border-violet-500/20 bg-violet-500/10 text-slate-300"
        }`}
      >
        <p className="font-semibold text-violet-500">
          Check your inbox
        </p>
        <p className="mt-1">
          Open the email → Confirm your email → Sign in
        </p>
      </div>

      <p className={`mt-5 text-xs ${mutedText}`}>
        Thank you for joining EduSphere. ✨
      </p>

      <button
        type="button"
        onClick={() => setShowVerificationMessage(false)}
        className="mt-6 w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
      >
        Back to Sign In
      </button>
    </div>
  </div>
)}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-white">
              <GraduationCap size={28} />
            </div>

            <h1 className="mt-4 text-2xl font-bold">
              Welcome to EduSphere
            </h1>

            <p className={`mt-2 text-sm ${mutedText}`}>
              {showSignup
                ? "Create your account and start learning."
                : "Sign in to continue your learning journey."}
            </p>
          </div>

          <div className="space-y-4">
          
{showForgotPassword ? (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Reset your password</h2>
    <p className={`text-sm ${mutedText}`}>
      Enter your email address to receive a password reset link.
    </p>
    <input
      type="email"
      placeholder="Email address"
      value={resetEmail}
      onChange={(event) => setResetEmail(event.target.value)}
      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
        isLight
          ? "border-slate-200 bg-slate-50"
          : "border-white/10 bg-white/5"
      }`}
    />
    <button
      type="button"
      onClick={handleForgotPassword}
      className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
    >
      Send Reset Link
    </button>
    <button
      type="button"
      onClick={() => {
        setShowForgotPassword(false);
        setResetEmail("");
      }}
      className="w-full text-sm text-violet-500 hover:text-violet-400"
    >
      Back to Sign In
    </button>
  </div>
) : null}

            {showSignup && (
              <input
                type="text"
                placeholder="Full name"
                value={signupName}
                onChange={(event) => setSignupName(event.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
                  isLight
                    ? "border-slate-200 bg-slate-50"
                    : "border-white/10 bg-white/5"
                }`}
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={showSignup ? signupEmail : loginEmail}
              onChange={(event) =>
                showSignup
                  ? setSignupEmail(event.target.value)
                  : setLoginEmail(event.target.value)
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
                isLight
                  ? "border-slate-200 bg-slate-50"
                  : "border-white/10 bg-white/5"
              }`}
            />

            <input
              type="password"
              placeholder="Password"
              value={showSignup ? signupPassword : loginPassword}
              onChange={(event) =>
                showSignup
                  ? setSignupPassword(event.target.value)
                  : setLoginPassword(event.target.value)
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
                isLight
                  ? "border-slate-200 bg-slate-50"
                  : "border-white/10 bg-white/5"
              }`}
            />
          {!showSignup && (
  <div className="flex justify-end">
    <button
      type="button"
      onClick={() => {
  setResetEmail(loginEmail);
  setShowForgotPassword(true);
}}
      className="text-sm font-medium text-violet-500 transition hover:text-violet-400"
    >
      Forgot password?
    </button>
  </div>
)}
            {showSignup && signupPassword.length > 0 && (
  <div className="space-y-2 rounded-xl border border-white/10 p-3 text-xs">
    {[
      {
        label: "At least 8 characters",
        valid: signupPassword.length >= 8,
      },
      {
        label: "At least 1 uppercase letter",
        valid: /[A-Z]/.test(signupPassword),
      },
      {
        label: "At least 1 lowercase letter",
        valid: /[a-z]/.test(signupPassword),
      },
      {
        label: "At least 1 number",
        valid: /[0-9]/.test(signupPassword),
      },
      {
        label: "At least 1 special character",
        valid: /[^A-Za-z0-9]/.test(signupPassword),
      },
    ].map((rule) => (
      <div
        key={rule.label}
        className={rule.valid ? "text-emerald-500" : "text-red-500"}
      >
        {rule.valid ? "✓" : "✕"} {rule.label}
      </div>
    ))}
  </div>
)}

            <button
  type="button"
  onClick={async () => {
  if (showSignup) {
    if (
      !signupName.trim() ||
      !signupEmail.trim() ||
      !signupPassword.trim()
    ) {
      showToast("Please fill in all fields.", "error");

      return;
    }

    if (
      signupPassword.length < 8 ||
      !/[A-Z]/.test(signupPassword) ||
      !/[a-z]/.test(signupPassword) ||
      !/[0-9]/.test(signupPassword) ||
      !/[^A-Za-z0-9]/.test(signupPassword)
    ) {
      showToast(
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
  "error"
);
      return;
    }

    
const { error } = await supabase.auth.signUp({
  email: signupEmail.trim(),
  password: signupPassword,
  options: {
    data: {
      full_name: signupName.trim(),
    },
    emailRedirectTo: `${window.location.origin}/`,
  },
});


    if (error) {
      showToast(error.message, "error");
      return;
    }

    setSignupName("");
setSignupEmail("");
setSignupPassword("");
setShowVerificationMessage(true);
setShowSignup(false);
  } else {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast("Please enter your email and password.", "error");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    
if (error) {
  showToast(error.message, "error");
  return;
}

const { data: sessionData, error: sessionError } =
  await supabase.auth.getSession();

if (sessionError || !sessionData.session) {
  showToast("Login succeeded, but session could not be loaded.", "error");
  return;
}

const user = sessionData.session.user;
const metadataName = user.user_metadata?.full_name;

setCurrentUserName(
  typeof metadataName === "string" && metadataName.trim()
    ? metadataName
    : user.email ?? ""
);

setLoginEmail(user.email ?? "");
setIsLoggedIn(true);
showToast("Login successful!", "success");

  }
}}
  className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
>
  {showSignup ? "Create Account" : "Sign In"}
</button>
          </div>

          <button
            type="button"
            onClick={() => setShowSignup((current) => !current)}
            className="mt-5 w-full text-center text-sm font-medium text-violet-500 hover:text-violet-400"
          >
            {showSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Create one"}
          </button>
        </div>
      )}
    </main>
  );
}
  return (
    <main className={`min-h-screen flex flex-col ${pageBackground} ${pageText}`}>
      
    {toastMessage && (
  <div
    className={`fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
      toastType === "success"
        ? "border-emerald-500/20 bg-[#191927] text-emerald-400"
        : "border-red-500/20 bg-[#191927] text-red-400"
    }`}
  >
    <span className="text-lg">
      {toastType === "success" ? "✓" : "!"}
    </span>
    <p className="text-sm font-medium">{toastMessage}</p>
  </div>
)}
<div className="flex flex-1 w-full items-center justify-center p-6"></div>
      <div className="flex min-h-screen">
        <aside
          className={`hidden w-64 shrink-0 flex-col border-r p-5 md:flex ${
            isLight
              ? "border-slate-200 bg-white"
              : "border-white/[0.08] bg-[#151522]"
          }`}
        >
          <button
            onClick={() => navigateTo("Overview")}
            className="mb-10 flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500 text-white">
              <GraduationCap size={25} />
            </div>
            <div>
              <h1 className="text-lg font-bold">EduSphere</h1>
              <p className={`text-xs ${mutedText}`}>Learning dashboard</p>
            </div>
          </button>

          <p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] ${mutedText}`}>
            Workspace
          </p>

          <nav className="space-y-2">
            <button
              onClick={() => navigateTo("Overview")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                activeNav === "Overview"
                  ? "bg-violet-500 text-white"
                  : `${mutedText} hover:bg-violet-500/10 hover:text-violet-500`
              }`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>

            <button
              onClick={() => navigateTo("My Courses")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                activeNav === "My Courses"
                  ? "bg-violet-500 text-white"
                  : `${mutedText} hover:bg-violet-500/10 hover:text-violet-500`
              }`}
            >
              <BookOpen size={18} />
              My Courses
            </button>

            <button
              onClick={() => navigateTo("Study Goals")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                activeNav === "Study Goals"
                  ? "bg-violet-500 text-white"
                  : `${mutedText} hover:bg-violet-500/10 hover:text-violet-500`
              }`}
            >
              <Target size={18} />
              Study Goals
            </button>

            <button
              onClick={() => navigateTo("Schedule")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                activeNav === "Schedule"
                  ? "bg-violet-500 text-white"
                  : `${mutedText} hover:bg-violet-500/10 hover:text-violet-500`
              }`}
            >
              <CalendarDays size={18} />
              Schedule
            </button>
            <button
  onClick={() => navigateTo("Chatbot")}
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
    activeNav === "Chatbot"
      ? "bg-violet-500 text-white"
      : `${mutedText} hover:bg-violet-500/10 hover:text-violet-500`
  }`}
>
  <Bot size={18} />
  Chatbot
             </button>
             <button
  onClick={() => navigateTo("Profile")}
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
    activeNav === "Profile"
      ? "bg-violet-500 text-white"
      : `${mutedText} hover:bg-violet-500/10 hover:text-violet-500`
  }`}
>
  <User size={18} />
  Profile
</button>
              
          </nav>

          <div className="mt-auto rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-violet-500">
              <GraduationCap size={19} />
            </div>
            <h3 className="text-sm font-semibold">Keep learning!</h3>
            <p className={`mt-2 text-xs leading-5 ${mutedText}`}>
              Small daily progress leads to big achievements.
            </p>
          </div>
        </aside>

        <nav
  className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t px-1 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden ${
    isLight
      ? "border-slate-200 bg-white/95"
      : "border-white/10 bg-[#151522]/95"
  }`}
>
  {[
    { label: "Overview", icon: LayoutDashboard },
    { label: "My Courses", icon: BookOpen },
    { label: "Study Goals", icon: Target },
    { label: "Schedule", icon: CalendarDays },
    { label: "Profile", icon: User },
  ].map(({ label, icon: Icon }) => (
    <button
      key={label}
      type="button"
      onClick={() => navigateTo(label)}
      className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[10px] ${
        activeNav === label
          ? "text-violet-500"
          : mutedText
      }`}
    >
      <Icon size={19} />
      <span>{label}</span>
    </button>
  ))}
</nav>

        <section className="min-w-0 flex-1">
          <button
  type="button"
  onClick={() => navigateTo("Chatbot")}
  className="fixed bottom-24 right-4 z-[60] flex items-center gap-2 rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
  aria-label="Ask EduSphere AI"
>
  <Bot size={21} />
  <span>Ask EduSphere</span>
  <span className="h-2 w-2 rounded-full bg-emerald-300" />
</button>
          <header
            className={`sticky top-0 z-20 flex items-center justify-between gap-4 border-b px-5 py-4 backdrop-blur-xl md:px-8 ${
              isLight
                ? "border-slate-200 bg-white/90"
                : "border-white/[0.08] bg-[#10101b]/90"
            }`}
          >
            <div>
              <p className={`text-xs ${mutedText}`}>Welcome back</p>
              <h2 className="mt-1 text-lg font-bold">
  {currentUserName ? `Welcome, ${currentUserName}` : "Your Learning Space"}
</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`}
                />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search courses..."
                  className={`w-52 rounded-xl border py-2.5 pl-9 pr-3 text-xs outline-none focus:border-violet-500 ${
                    isLight
                      ? "border-slate-200 bg-slate-50 text-slate-900"
                      : "border-white/10 bg-white/5 text-white"
                  }`}
                />
              </div>

              <button
                onClick={() => setIsLight((current) => !current)}
                aria-label="Toggle theme"
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  isLight
                    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {isLight ? <Moon size={18} /> : <Sun size={18} />}
              </button>
                            <button
                
onClick={async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    showToast("Unable to log out. Please try again.", "error");
    return;
  }

  localStorage.removeItem("edusphere-logged-in");
  localStorage.removeItem("edusphere-user");
  setIsLoggedIn(false);
}}

                className="rounded-xl bg-red-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-400"
              >
                Logout
              </button>

            </div>
          </header>
          {activeNav === "Overview" && searchQuery.trim() && (
  <section className="mx-auto max-w-7xl px-5 pt-5 md:px-8">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-sm font-semibold">
        Search Results
      </h2>
      <span className={`text-xs ${mutedText}`}>
        {visibleCourses.length} course(s) found
      </span>
    </div>

    {visibleCourses.length > 0 ? (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleCourses.map((course) => (
          <button
            key={course.id}
            onClick={() => openCourse(course)}
            className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:border-violet-400/40 ${cardStyle}`}
          >
            <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-slate-200">
              <img
                src={courseCoverImages[course.title]}
                alt={`${course.title} course cover`}
                className="h-full w-full object-cover"
              />
            </div>

            <h3 className="text-sm font-semibold">
              {course.title}
            </h3>

            <p className={`mt-2 text-xs ${mutedText}`}>
              {course.category} · {course.level}
            </p>

            <p className="mt-3 text-xs font-semibold text-violet-500">
              View course →
            </p>
          </button>
        ))}
      </div>
    ) : (
      <div className={`rounded-xl border p-6 text-center text-sm ${cardStyle} ${mutedText}`}>
        No courses match your search.
      </div>
    )}
  </section>
)}
                    <div className="mx-auto max-w-7xl space-y-8 p-5 md:p-8">
            {activeNav === "My Courses" ? (
              <section>
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
                    Learning library
                  </p>
                  <h1 className="mt-2 text-2xl font-bold">My Courses</h1>
                  <p className={`mt-2 text-sm ${mutedText}`}>
                    Explore your enrolled courses and track your progress.
                  </p>
                </div>

                {selectedCourse ? (
                  <div>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                        isLight
                          ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      ← Back to My Courses
                    </button>

                    <div className={`max-w-3xl rounded-2xl border p-6 ${cardStyle}`}>
                      <div className="mb-5 h-44 w-full overflow-hidden rounded-xl">
  <img
    src={courseCoverImages[selectedCourse.title]}
    alt={`${selectedCourse.title} course cover`}
    className="h-full w-full object-cover"
  />
</div>

                      <span className="text-xs font-medium text-violet-500">
                        {selectedCourse.category}
                      </span>

                      <h2 className="mt-2 text-xl font-semibold">
                        {selectedCourse.title}
                      </h2>

                      <p className={`mt-2 text-sm ${mutedText}`}>
                        {selectedCourse.category} · {selectedCourse.level}
                      </p>

                      <div className="mt-6">
                        <div className="mb-2 flex justify-between text-xs">
                          <span className={mutedText}>Course progress</span>
                          <span className="font-semibold text-violet-500">
                            {getCourseProgress(selectedCourse)}%
                          </span>
                        </div>

                        <div
                          className={`h-2 overflow-hidden rounded-full ${
                            isLight ? "bg-slate-200" : "bg-[#303044]"
                          }`}
                        >
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: `${getCourseProgress(selectedCourse)}%` }}
                          />
                        </div>
                      </div>

                      <div
                        className={`mt-6 rounded-xl border p-4 ${
                          isLight
                            ? "border-slate-200"
                            : "border-white/[0.08]"
                        }`}
                      >
                        <h3 className="text-sm font-semibold">
                          Current learning
                        </h3>
                        <p className={`mt-2 text-xs ${mutedText}`}>
                          Completed lessons: {completedLessons[selectedCourse.id]?.length ?? 0} / {selectedCourse.lessonTopics.length}
                        </p>
                        <p className={`mt-2 text-xs ${mutedText}`}>
                          Next topic: {selectedCourse.next}
                        </p>
                        <p className={`mt-2 text-xs ${mutedText}`}>
                          Course duration: {selectedCourse.duration}
                        </p>
                      </div>
                                            <button
                        onClick={() => {
  const lessons = selectedCourse.lessonTopics;
  const completed = completedLessons[selectedCourse.id] ?? [];
  const nextLesson = lessons.find(
    (lesson) => !completed.includes(lesson)
  );

  setSelectedLesson(nextLesson ?? lessons[0] ?? null);
}}
                        className="mt-6 flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-violet-400"
                      >
                        Continue Learning <ArrowRight size={14} />
                      </button>

                      <div
                        className={`mt-6 rounded-xl border p-4 ${
                          isLight ? "border-slate-200" : "border-white/[0.08]"
                        }`}
                      >
                                              <div
                        className={`mt-6 rounded-xl border p-4 ${
                          isLight ? "border-slate-200" : "border-white/[0.08]"
                        }`}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-sm font-semibold">
                            Course Lessons
                          </h3>
                          <span className="text-xs text-violet-500">
                            {selectedCourse.lessonTopics.length} lessons
                          </span>
                        </div>

                        <div className="space-y-2">
                          {selectedCourse.lessonTopics.map((lesson, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-3 rounded-lg border p-3 ${
                                isLight
                                  ? "border-slate-200 bg-slate-50"
                                  : "border-white/[0.06] bg-white/[0.03]"
                              }`}
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-500">
                                {index + 1}
                              </div>

                              <span className="min-w-0 flex-1 text-xs font-medium">
                                {lesson}
                              </span>

                              <button
                                onClick={() => setSelectedLesson(lesson)}
                                className="shrink-0 rounded-lg bg-violet-500/10 px-3 py-2 text-[10px] font-semibold text-violet-500 transition hover:bg-violet-500 hover:text-white"
                              >
                                Start Lesson
                              </button>
                            </div>
                          ))}
                        </div>

                        {selectedLesson && selectedCourse && (
  <div
    ref={lessonContentRef}
    className="mt-5 scroll-mt-6 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"
  >
    <button
      onClick={() => setSelectedLesson(null)}
      className="mb-4 rounded-lg border border-violet-500/30 px-3 py-2 text-xs font-semibold text-violet-500 hover:bg-violet-500/10"
    >
      ← Back to Lessons
    </button>

    <p className="text-xs text-violet-500">
      Lesson {selectedLessonIndex + 1} of {selectedCourse.lessonTopics.length}
    </p>

    <h3 className="mt-2 text-lg font-semibold">
      {selectedLesson}
    </h3>

    {courseVideos[selectedCourse.title] && (
      <section className="mt-5">
        <h4 className="mb-3 text-sm font-semibold">Video Lesson</h4>

        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          <iframe
            className="h-full w-full"
            src={courseVideos[selectedCourse.title]}
            title={`${selectedCourse.title} video lesson`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>
    )}

    {selectedMaterial ? (
      <div className="mt-5 space-y-5">
        <section>
          <h4 className="text-sm font-semibold">Overview</h4>
          <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
            {selectedMaterial.overview}
          </p>
        </section>

        <section>
          <h4 className="text-sm font-semibold">Study Notes</h4>
          <ul className={`mt-2 list-disc space-y-2 pl-5 text-sm leading-6 ${mutedText}`}>
            {selectedMaterial.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-semibold">Code Example</h4>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-green-300">
            <code>{selectedMaterial.example}</code>
          </pre>
        </section>

        <section>
          <h4 className="text-sm font-semibold">Practice Tasks</h4>
          <ol className={`mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 ${mutedText}`}>
            {selectedMaterial.practice.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-lg border border-violet-500/20 p-4">
          <h4 className="text-sm font-semibold">Quick Quiz</h4>
          <p className={`mt-2 text-sm ${mutedText}`}>
            {selectedMaterial.quiz}
          </p>

          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-medium text-violet-500">
              Show Answer
            </summary>
            <p className={`mt-2 text-sm ${mutedText}`}>
              {selectedMaterial.answer}
            </p>
          </details>
        </section>
      </div>
    ) : (
      <p className={`mt-4 text-sm ${mutedText}`}>
        Study material for this lesson is being prepared.
      </p>
    )}

    <div className="mt-6 flex items-center justify-between gap-3 border-t border-violet-500/20 pt-4">
      <button
        onClick={() => setSelectedLesson(null)}
        className="rounded-lg border border-violet-500/30 px-4 py-2 text-xs font-semibold text-violet-500 hover:bg-violet-500/10"
      >
        All Lessons
      </button>

      {selectedLessonIndex < selectedCourse.lessonTopics.length - 1 ? (
        <button
          onClick={() => {
  completeLesson(selectedCourse, selectedLesson);

  setSelectedLesson(
    selectedCourse.lessonTopics[selectedLessonIndex + 1]
  );
}}
          className="rounded-lg bg-violet-500 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-400"
        >
          Next Lesson →
        </button>
      ) : (
  <button
    onClick={() => completeLesson(selectedCourse, selectedLesson)}
    className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400"
  >
    Complete Course ✓
  </button>
)}
    </div>
  </div>
)}
                      </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visibleCourses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => openCourse(course)}
                        className={`rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:border-violet-400/40 ${cardStyle}`}
                      >
                        <div className="mb-4 h-36 w-full overflow-hidden rounded-xl bg-slate-200">
  <img
    src={courseCoverImages[course.title]}
    alt={`${course.title} course cover`}
    className="h-full w-full object-cover"
  />
</div>

                        <h2 className="text-sm font-semibold">
                          {course.title}
                        </h2>

                        <p className={`mt-2 text-xs ${mutedText}`}>
                          {course.category} · {course.level}
                        </p>

                        <div className="mt-4 flex items-center justify-between text-xs">
                          <span className={mutedText}>Progress</span>
                          <span className="font-semibold text-violet-500">
                            {getCourseProgress(course)}%
                          </span>
                        </div>

                        <div
                          className={`mt-2 h-1.5 overflow-hidden rounded-full ${
                            isLight ? "bg-slate-200" : "bg-[#303044]"
                          }`}
                        >
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: `${getCourseProgress(course)}%` }}
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2 text-xs font-semibold text-violet-500">
                          View course <ArrowRight size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!selectedCourse && visibleCourses.length === 0 && (
                  <div
                    className={`rounded-xl border p-8 text-center text-sm ${cardStyle} ${mutedText}`}
                  >
                    No courses match your search.
                  </div>
                )}
              </section>
            ) : activeNav === "Overview" ? (
              <>
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-6 text-white md:p-8">
                  <div className="relative z-10 max-w-xl">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                      Your learning journey
                    </span>
                    <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
                      Learn something new every day.
                    </h1>
                    <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
                      Build your skills, stay consistent, and keep moving
                      toward your academic goals.
                    </p>
                    <button
                      onClick={() => navigateTo("My Courses")}
                      className="mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                    >
                      Explore My Courses <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10" />
                  <div className="absolute -bottom-24 right-28 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
                  <GraduationCap
                    size={130}
                    className="absolute bottom-5 right-8 hidden text-white/15 md:block"
                  />
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className={`rounded-2xl border p-5 ${cardStyle}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${mutedText}`}>Enrolled courses</p>
                      <BookOpen size={19} className="text-violet-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold">03</p>
                    <p className={`mt-1 text-xs ${mutedText}`}>
                      Active learning courses
                    </p>
                  </div>

                  <div className={`rounded-2xl border p-5 ${cardStyle}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${mutedText}`}>Lessons completed</p>
                      <Check size={19} className="text-emerald-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold">54</p>
                    <p className={`mt-1 text-xs ${mutedText}`}>
                      Across all courses
                    </p>
                  </div>

                  <div className={`rounded-2xl border p-5 ${cardStyle}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${mutedText}`}>Study hours</p>
                      <CalendarDays size={19} className="text-cyan-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold">28.5</p>
                    <p className={`mt-1 text-xs ${mutedText}`}>
                      This month
                    </p>
                  </div>

                  <div className={`rounded-2xl border p-5 ${cardStyle}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${mutedText}`}>Study goals done</p>
                      <Target size={19} className="text-amber-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold">
                      {completedTasks}/{tasks.length}
                    </p>
                    <p className={`mt-1 text-xs ${mutedText}`}>
                      Your personal task list
                    </p>
                  </div>
                </section>
                                <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                  <div className={`rounded-2xl border p-5 md:p-6 ${cardStyle}`}>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold">
                          Continue Learning
                        </h2>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          Pick up where you left off
                        </p>
                      </div>
                      <button
                        onClick={() => navigateTo("My Courses")}
                        className="text-xs font-semibold text-violet-500 hover:text-violet-400"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-4">
                      {courses.slice(0, 2).map((course) => (
                        <div
                          key={course.id}
                          className={`rounded-xl border p-4 ${
                            isLight
                              ? "border-slate-200 bg-slate-50"
                              : "border-white/[0.07] bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
  <img
    src={courseCoverImages[course.title]}
    alt={`${course.title} course cover`}
    className="h-full w-full object-cover"
  />
</div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold">
                                {course.title}
                              </h3>
                              <p className={`mt-1 text-xs ${mutedText}`}>
                                {completedLessons[course.id]?.length ?? 0} / {course.lessonTopics.length} lessons completed
                              </p>

                              <div
                                className={`mt-3 h-1.5 overflow-hidden rounded-full ${
                                  isLight ? "bg-slate-200" : "bg-[#303044]"
                                }`}
                              >
                                <div
                                  className="h-full rounded-full bg-violet-500"
                                  style={{
  width: `${
    course.lessonTopics.length > 0
      ? Math.round(
          ((completedLessons[course.id]?.length ?? 0) /
            course.lessonTopics.length) *
            100
        )
      : 0
  }%`,
}}
                                />
                              </div>

                              <div className="mt-2 flex items-center justify-between">
                                <span className={`text-[10px] ${mutedText}`}>
                                  {getCourseProgress(course)}% completed
                                </span>
                                <button
                                  onClick={() => openCourse(course)}
                                  className="flex items-center gap-1 text-[10px] font-semibold text-violet-500"
                                >
                                  Open <ArrowRight size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-5 md:p-6 ${cardStyle}`}>
                    <div className="mb-6">
                      <h2 className="text-base font-semibold">
                        Weekly Activity
                      </h2>
                      <p className={`mt-1 text-xs ${mutedText}`}>
                        Your study consistency
                      </p>
                    </div>

                    <div className="flex h-44 items-end justify-between gap-2">
                      {weeklyActivity.map((item) => (
                        <div
                          key={item.day}
                          className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                        >
                          <div className="flex h-full w-full items-end">
                            <div
                              className={`w-full rounded-t-md transition ${
                                item.day === "Sat"
                                  ? "bg-violet-500"
                                  : "bg-violet-500/35"
                              }`}
                              style={{ height: `${item.value}%` }}
                            />
                          </div>
                          <span className={`text-[10px] ${mutedText}`}>
                            {item.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                  <div className={`rounded-2xl border p-5 md:p-6 ${cardStyle}`}>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold">
                          Upcoming Schedule
                        </h2>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          Your planned learning sessions
                        </p>
                      </div>
                      <CalendarDays size={19} className="text-violet-500" />
                    </div>

                    <div className="space-y-3">
                      {schedule.map((item, index) => (
                        <div
                          key={item.title}
                          className={`flex items-center gap-3 rounded-xl border p-3 ${
                            isLight
                              ? "border-slate-200"
                              : "border-white/[0.07]"
                          }`}
                        >
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
  {courseCoverImages[item.title] ? (
    <img
      src={courseCoverImages[item.title]}
      alt={`${item.title} course cover`}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-violet-500/10 text-violet-500">
      {index === 0 ? <Video size={18} /> : <BookOpen size={18} />}
    </div>
  )}
</div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs font-semibold">
                              {item.title}
                            </h3>
                            <p className={`mt-1 text-[10px] ${mutedText}`}>
                              {item.detail}
                            </p>
                          </div>
                          <span className="text-[10px] font-medium text-violet-500">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-5 md:p-6 ${cardStyle}`}>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold">
                          Study Goals
                        </h2>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          Add and track your personal tasks
                        </p>
                      </div>
                      <Target size={19} className="text-violet-500" />
                    </div>

                    <form onSubmit={addTask} className="mb-4 flex gap-2">
                      <input
                        value={newTask}
                        onChange={(event) => setNewTask(event.target.value)}
                        placeholder="Add a study goal..."
                        className={`min-w-0 flex-1 rounded-xl border px-3 py-3 text-xs outline-none focus:border-violet-500 ${
                          isLight
                            ? "border-slate-200 bg-slate-50 text-slate-900"
                            : "border-white/10 bg-white/5 text-white"
                        }`}
                      />
                      <button
                        type="submit"
                        aria-label="Add study goal"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400"
                      >
                        <Plus size={18} />
                      </button>
                    </form>

                    <div className="space-y-2">
                      {tasks.length === 0 ? (
                        <p className={`rounded-xl py-6 text-center text-xs ${mutedText}`}>
                          No goals added yet. Add your first study goal above.
                        </p>
                      ) : (
                        tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-center gap-3 rounded-xl border p-3 ${
                              isLight
                                ? "border-slate-200"
                                : "border-white/[0.07]"
                            }`}
                          >
                            <button
                              onClick={() => toggleTask(task.id)}
                              aria-label={
                                task.completed
                                  ? "Mark task incomplete"
                                  : "Complete task"
                              }
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                task.completed
                                  ? "border-violet-500 bg-violet-500 text-white"
                                  : "border-slate-400"
                              }`}
                            >
                              {task.completed && <Check size={13} />}
                            </button>

                            <span
                              className={`min-w-0 flex-1 text-xs ${
                                task.completed
                                  ? "text-slate-400 line-through"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </span>

                            <button
                              onClick={() => deleteTask(task.id)}
                              aria-label="Delete task"
                              className="text-slate-400 transition hover:text-red-500"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {tasks.length > 0 && (
                      <p className={`mt-4 text-[10px] ${mutedText}`}>
                        {completedTasks} of {tasks.length} goals completed
                      </p>
                    )}
                  </div>
                </section>
                                <section className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-5 md:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500">
                        <GraduationCap size={25} />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold">
                          Your learning companion
                        </h2>
                        <p className={`mt-2 max-w-xl text-xs leading-5 ${mutedText}`}>
                          Stay organized, review your course progress, and
                          maintain a consistent study routine.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateTo("Study Goals")}
                      className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-violet-400"
                    >
                      Manage Goals <ArrowRight size={14} />
                    </button>
                  </div>
                </section>
              </>
            ) : activeNav === "Study Goals" ? (
              <section>
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
                    Personal productivity
                  </p>
                  <h1 className="mt-2 text-2xl font-bold">Study Goals</h1>
                  <p className={`mt-2 text-sm ${mutedText}`}>
                    Create tasks and track your progress.
                  </p>
                </div>

                <div className={`max-w-2xl rounded-2xl border p-5 md:p-6 ${cardStyle}`}>
                  <form onSubmit={addTask} className="mb-5 flex gap-2">
                    <input
                      value={newTask}
                      onChange={(event) => setNewTask(event.target.value)}
                      placeholder="Add a study goal..."
                      className={`min-w-0 flex-1 rounded-xl border px-3 py-3 text-xs outline-none focus:border-violet-500 ${
                        isLight
                          ? "border-slate-200 bg-slate-50 text-slate-900"
                          : "border-white/10 bg-white/5 text-white"
                      }`}
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-xs font-semibold text-white hover:bg-violet-400"
                    >
                      <Plus size={15} /> Add
                    </button>
                  </form>

                  <div className="mb-5 flex items-center justify-between">
                    <span className={`text-xs ${mutedText}`}>
                      Completed goals
                    </span>
                    <span className="text-sm font-semibold text-violet-500">
                      {completedTasks} / {tasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tasks.length === 0 ? (
                      <p className={`py-8 text-center text-sm ${mutedText}`}>
                        You have no study goals yet.
                      </p>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 rounded-xl border p-4 ${
                            isLight
                              ? "border-slate-200"
                              : "border-white/[0.07]"
                          }`}
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                              task.completed
                                ? "border-violet-500 bg-violet-500 text-white"
                                : "border-slate-400"
                            }`}
                          >
                            {task.completed && <Check size={13} />}
                          </button>
                          <span
                            className={`flex-1 text-sm ${
                              task.completed
                                ? "text-slate-400 line-through"
                                : ""
                            }`}
                          >
                            {task.title}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            aria-label="Delete task"
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            ) : activeNav === "Schedule" ? (
              <section>
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
                    Learning calendar
                  </p>
                  <h1 className="mt-2 text-2xl font-bold">Schedule</h1>
                  <p className={`mt-2 text-sm ${mutedText}`}>
                    Your planned learning sessions.
                  </p>
                </div>

                <div className={`max-w-2xl rounded-2xl border p-5 md:p-6 ${cardStyle}`}>
                  <div className="space-y-4">
                    {schedule.map((item, index) => (
                      <div
                        key={item.title}
                        className={`flex items-center gap-4 rounded-xl border p-4 ${
                          isLight
                            ? "border-slate-200"
                            : "border-white/[0.07]"
                        }`}
                      >
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl">
  {courseCoverImages[item.title] ? (
    <img
      src={courseCoverImages[item.title]}
      alt={`${item.title} course cover`}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-violet-500/10 text-violet-500">
      {index === 0 ? (
        <Video size={20} />
      ) : (
        <BookOpen size={20} />
      )}
    </div>
  )}
</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold">
                            {item.title}
                          </h3>
                          <p className={`mt-1 text-xs ${mutedText}`}>
                            {item.detail}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-violet-500">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                            </section>
            ) : activeNav === "Chatbot" ? (
              <section className="relative">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
                    AI learning assistant
                  </p>
                  <h1 className="mt-2 text-2xl font-bold">Study Chatbot</h1>
                  <p className={`mt-2 text-sm ${mutedText}`}>
                    Ask questions about programming, courses, and your studies.
                  </p>
                </div>
                
                  <div
  className={`hidden md:block absolute left-0 top-[110px] w-56 rounded-2xl border p-4 ${cardStyle}`}
>
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-sm font-semibold">Chat History</h2>

    <button
      type="button"
      onClick={() => {
        setChatMessages([]);
        setCurrentChatId(null);
      }}
      className="rounded-lg px-2 py-1 text-xs text-violet-500 transition hover:bg-violet-500/10"
    >
      + New
    </button>
  </div>

  {chatHistory.length === 0 ? (
    <p className={`text-xs leading-5 ${mutedText}`}>
      No previous chats yet.
    </p>
  ) : (
    <div className="max-h-[420px] space-y-2 overflow-y-auto">
      {chatHistory.map((chat, index) => (
  <div
    key={`${chat.id}-${index}`}
    className={`flex items-center gap-1 rounded-xl transition ${
      currentChatId === chat.id
        ? "bg-violet-500/10"
        : isLight
          ? "hover:bg-slate-100"
          : "hover:bg-white/[0.06]"
    }`}
  >
    <button
      type="button"
      onClick={() => {
        setChatMessages(chat.messages);
        setCurrentChatId(chat.id);
      }}
      className={`min-w-0 flex-1 rounded-xl px-3 py-2 text-left text-xs ${
        currentChatId === chat.id
          ? "text-violet-500"
          : ""
      }`}
    >
      <span className="block truncate">{chat.title}</span>
    </button>

    <button
      type="button"
      onClick={() => {
        setChatHistory((current) =>
          current.filter((item) => item.id !== chat.id)
        );

        if (currentChatId === chat.id) {
          setChatMessages([]);
          setCurrentChatId(null);
        }
      }}
      aria-label={`Delete ${chat.title}`}
      className={`mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
        isLight
          ? "text-slate-400 hover:bg-red-50 hover:text-red-500"
          : "text-slate-500 hover:bg-red-500/10 hover:text-red-400"
      }`}
    >
      <Trash2 size={14} />
    </button>
  </div>
))}
    </div>
  )}
</div>
                
                <div className={`mx-auto flex min-h-[500px] w-full min-w-0 max-w-3xl flex-col rounded-2xl border ${cardStyle} md:ml-60 md:w-[calc(100%-15rem)]`}>
                  <div className="flex items-center gap-3 border-b border-white/[0.08] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">EduSphere Assistant</h2>
                      <p className={`mt-1 text-xs ${mutedText}`}>
                        Your study companion
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
  {chatMessages.length > 0 && (
    <button
      type="button"
      onClick={() => setChatMessages([])}
      className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
        isLight
          ? "text-slate-500 hover:bg-slate-100 hover:text-red-500"
          : "text-slate-400 hover:bg-white/[0.06] hover:text-red-400"
      }`}
    >
      Clear chat
    </button>
  )}

  <span className="flex items-center gap-2 text-xs text-emerald-500">
    <span className="h-2 w-2 rounded-full bg-emerald-500" />
    Online
  </span>
</div>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
  {chatMessages.length === 0 ? (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <h3 className="text-lg font-semibold">
        Hi! How can I help you learn?
      </h3>
      <p className={`mt-2 max-w-md text-sm leading-6 ${mutedText}`}>
        Ask me a question about programming, computer science,
        or your study topics.
      </p>
    </div>
  ) : (
    chatMessages.map((message, index) => (
      <div
  key={index}
  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
    message.role === "user"
      ? "ml-auto bg-violet-500 text-white"
      : isLight
        ? "mr-auto bg-slate-100 text-slate-800"
        : "mr-auto bg-white/[0.08] text-slate-100"
  }`}
>
  <div className="prose prose-sm max-w-none">
  <ReactMarkdown
    components={{
      code({ children }) {
        return (
          <code className="rounded-md bg-black/20 px-1.5 py-0.5 font-mono text-xs">
            {children}
          </code>
        );
      },
    }}
  >
    {message.content}
  </ReactMarkdown>
</div>
</div>
    ))
  )}
  {isChatLoading && (
  <div
    className={`mr-auto flex items-center gap-3 rounded-2xl px-4 py-3 ${
      isLight
        ? "bg-slate-100 text-slate-600"
        : "bg-white/[0.08] text-slate-300"
    }`}
  >
    <Bot size={18} className="text-violet-500" />

    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500" />
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-violet-500"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-violet-500"
        style={{ animationDelay: "300ms" }}
      />
    </div>

    <span className="text-xs">
      EduSphere is thinking...
    </span>
  </div>
)}
</div>

                  <div className="border-t border-white/[0.08] p-4">
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.12] p-3">
                      <input
  type="text"
  value={chatInput}
  onChange={(event) => setChatInput(event.target.value)}
  onKeyDown={(event) => {
    if (event.key === "Enter") sendChatMessage();
  }}
  placeholder="Ask your study question..."
  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
/>
                      <button
  type="button"
  onClick={sendChatMessage}
  disabled={isChatLoading}
  aria-label="Send message"
  className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
>
  <ArrowRight size={18} />
</button>
                    </div>
                    <p className={`mt-3 text-center text-[11px] ${mutedText}`}>
                      Powered by AI · Your personal learning assistant
                    </p>
                  </div>
                </div>
              </section>
              ) : activeNav === "Profile" ? (
  <section>
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
        Account settings
      </p>
      <h1 className="mt-2 text-2xl font-bold">My Profile</h1>
      <p className={`mt-2 text-sm ${mutedText}`}>
        Manage your personal information and account details.
      </p>
    </div>

    <div className={`max-w-3xl rounded-3xl border p-6 md:p-8 ${cardStyle}`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        
<div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-500/10 text-violet-500">
  {avatarUrl ? (
    <img
      src={avatarUrl}
      alt="Profile photo"
      className="h-full w-full object-cover"
    />
  ) : (
    <User size={38} />
  )}
</div>


        <div>
          <h2 className="text-lg font-semibold">Profile Photo</h2>
          <p className={`mt-1 text-xs ${mutedText}`}>
            Upload a profile photo to personalize your account.
          </p>

          
<input
  id="avatar-upload"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be smaller than 5 MB.", "error");
      e.target.value = "";
      return;
    }

    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData.user) {
      showToast("Please sign in again.", "error");
      e.target.value = "";
      return;
    }

    setAvatarLoading(true);

    try {
      const filePath = `${userData.user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
  console.error("Avatar upload error:", uploadError);
  showToast(uploadError.message, "error");
  return;
}

      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const imageUrl = publicData.publicUrl;

      const { error: profileError } = await supabase
  .from("profiles")
  .upsert(
    {
      id: userData.user.id,
      avatar_url: imageUrl,
    },
    { onConflict: "id" }
  );

if (profileError) {
  console.error("Profile photo save error:", profileError);
  showToast(profileError.message, "error");
  return;
}

      setAvatarUrl(imageUrl);
      showToast("Profile photo uploaded successfully.", "success");
    } catch {
      showToast("Unable to upload profile photo.", "error");
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  }}
/>

<label
  htmlFor="avatar-upload"
  className={`mt-4 inline-flex cursor-pointer rounded-xl bg-violet-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-400 ${
    avatarLoading ? "pointer-events-none opacity-50" : ""
  }`}
>
  {avatarLoading ? "Uploading..." : "Change Photo"}
</label>

        </div>
      </div>

      <div className="my-8 border-t border-white/[0.08]" />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={`mb-2 block text-xs font-medium ${mutedText}`}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={profileFullName}
onChange={(e) => setProfileFullName(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
              isLight
                ? "border-slate-200 bg-slate-50 text-slate-900"
                : "border-white/10 bg-white/5 text-white"
            }`}
          />
        </div>

        <div>
          <label className={`mb-2 block text-xs font-medium ${mutedText}`}>
            Email Address
          </label>
          <input
            type="email"
            value={loginEmail}
            readOnly
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
              isLight
                ? "border-slate-200 bg-slate-100 text-slate-500"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
          />
        </div>

        <div>
          <label className={`mb-2 block text-xs font-medium ${mutedText}`}>
            Phone Number
          </label>
          <input
            type="tel"
            value={profilePhone}
            onChange={(e) => setProfilePhone(e.target.value)}
            placeholder="Enter phone number"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
              isLight
                ? "border-slate-200 bg-slate-50 text-slate-900"
                : "border-white/10 bg-white/5 text-white"
            }`}
          />
        </div>

        <div className="md:col-span-2">
  <label className={`mb-2 block text-xs font-medium ${mutedText}`}>
    Current Password
  </label>
  <input
    type="password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    placeholder="Enter your current password"
    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
      isLight
        ? "border-slate-200 bg-slate-50 text-slate-900"
        : "border-white/10 bg-white/5 text-white"
    }`}
  />
</div>

<div>
  <label className={`mb-2 block text-xs font-medium ${mutedText}`}>
    New Password
  </label>
  <input
    type="password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    placeholder="Enter new password"
    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
      isLight
        ? "border-slate-200 bg-slate-50 text-slate-900"
        : "border-white/10 bg-white/5 text-white"
    }`}
  />
</div>

<div>
  <label className={`mb-2 block text-xs font-medium ${mutedText}`}>
    Confirm New Password
  </label>
  <input
    type="password"
    value={confirmNewPassword}
    onChange={(e) => setConfirmNewPassword(e.target.value)}
    placeholder="Confirm new password"
    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500 ${
      isLight
        ? "border-slate-200 bg-slate-50 text-slate-900"
        : "border-white/10 bg-white/5 text-white"
    }`}
  />
</div>
      </div>

      <div className="mt-6 flex justify-end">
      <button
  type="button"
  onClick={handlePasswordChange}
  className="rounded-xl border border-violet-500/30 px-5 py-3 text-xs font-semibold text-violet-500 transition hover:bg-violet-500/10"
>
  Change Password
</button>
        
        <button
  type="button"
  onClick={handleProfileSave}
  disabled={profileLoading}
  className="rounded-xl bg-violet-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50"
>
  {profileLoading ? "Saving..." : "Save Changes"}
</button>
      </div>
    </div>
  </section>
            ) : null}

            <footer
              className={`border-t py-5 text-center text-[10px] ${mutedText} ${
                isLight ? "border-slate-200" : "border-white/[0.08]"
              }`}
            >
              EduSphere · Learning for everyone
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}