
let person = {
    firstName: 'John',
    lastName: 'Doe',
    age:30,
    hobbies: ['music', 'movies'],
    adress: {
        street: '50 main st',
        city: 'Boston',
        state: 'MA'
    }
}

const todos = [
    {
        id: 1,
        text: 'Take out trash',
        isCompleted: true
    },
    {
        id: 2,
        text: 'Meeting',
        isCompleted: true
    },
    {
        id: 3,
        text: 'Dentist',
        isCompleted: true
    }
]



for (let todo of todos) {
}
todos.forEach(function(todo){
})

const todoJSON = JSON.stringify(todos)

function Person(firstName, lastName, dob) {
    this.firstName = firstName; 
    this.lastName = lastName;
    this.dob = new Date(dob); 
    this.getBirthyear = function() {
        return this.dob; 
    }
}

console.log(document.getElementById('my-form'))
var person1 = new Person('John', 'Doe', '4-2-2018');
