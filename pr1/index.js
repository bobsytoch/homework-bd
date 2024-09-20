const fs = require('fs');
const readline = require('readline');

// Функція для завантаження та парсингу файлу students.txt
function loadStudents() {
    const data = fs.readFileSync('students.txt', 'utf-8');
    return data.split('\n').map(line => {
        const [StLastName, StFirstName, Grade, Classroom, Bus, TLastName, TFirstName] = line.split(',').map(x => x.trim());
        return { StLastName, StFirstName, Grade: +Grade, Classroom: +Classroom, Bus: +Bus, TLastName, TFirstName };
    });
}

// Функції для пошуку
// 1. За фамілією
const findStudentByLastName = (students, lastname) => {
    return students.filter(student => student.StLastName.toLowerCase() === lastname.toLowerCase())
}
// 2. З
const findBusRouteByStudent = (students, lastname, bus) =>  {
    return students.filter(student => student.StLastName.toLowerCase() === lastname.toLowerCase() && student.Bus == bus);
}

const findStudentsByTeacher = (students, teacherLastName) =>  {
    return students.filter(student => student.TLastName.toLowerCase() === teacherLastName.toLowerCase());
}

const findStudentsByClassroom = (students, classroom) =>  {
    return students.filter(student => student.Classroom === classroom);
}

const findStudentsByBusRoute = (students, busRoute) =>  {
    return students.filter(student => student.Bus === busRoute);
}

// Інтерфейс командного рядка
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const students = loadStudents();

function promptUser() {
    rl.question('Enter command. [S/SB/T/C/B/Q]: ', (input) => {
        const [command, arg1, arg2] = input.split(' ');
        
        let startTime, endTime;
        if (!command) console.log('ERROR! You\'re required to enter a command.')
        else if (command !== 'Q' && !arg1) console.log('ERROR! Each command requires supplemental info. Here\'s each one:\nS[tudents] <lastname>; SB <lastname> <busroute>; T[eacher] <lastname>; C[lassroom] <number>; B[us] <number>');
        else switch (command.toLowerCase()) {
            case 's':
                startTime = Date.now();
                const results = findStudentByLastName(students, arg1);
                results.forEach(student => console.log(`${student.StFirstName} ${student.StLastName} - Grade: ${student.Grade}, Classroom: ${student.Classroom}, Teacher: ${student.TFirstName} ${student.TLastName}, Bus: ${student.Bus}`));
                endTime = Date.now();
                console.log(`Search time: ${endTime - startTime}ms`);
                break;

            case 'sb':
                startTime = Date.now();
                if (!arg2) { console.log('No bus route specified!'); break; }
                const busbyln = findBusRouteByStudent(students, arg1, arg2);
                busbyln.forEach(student => console.log(`${student.StFirstName} ${student.StLastName} - Grade: ${student.Grade}, Classroom: ${student.Classroom}, Teacher: ${student.TFirstName} ${student.TLastName}, Bus: ${student.Bus}`));
                endTime = Date.now();
                console.log(`Search time: ${endTime - startTime}ms`);
                break;

            case 't':
                startTime = Date.now();
                const studentsByTeacher = findStudentsByTeacher(students, arg1);
                studentsByTeacher.forEach(student => console.log(`${student.StFirstName} ${student.StLastName} - Grade: ${student.Grade}, Classroom: ${student.Classroom}, Teacher: ${student.TFirstName} ${student.TLastName}, Bus: ${student.Bus}`));
                endTime = Date.now();
                console.log(`Search time: ${endTime - startTime}ms`);
                break;

            case 'c':
                startTime = Date.now();
                const studentsByClassroom = findStudentsByClassroom(students, parseInt(arg1));
                studentsByClassroom.forEach(student => console.log(`${student.StFirstName} ${student.StLastName}`));
                endTime = Date.now();
                console.log(`Search time: ${endTime - startTime}ms`);
                break;

            case 'b':
                startTime = Date.now();
                const studentsByBusRoute = findStudentsByBusRoute(students, parseInt(arg1));
                studentsByBusRoute.forEach(student => console.log(`${student.StFirstName} ${student.StLastName} - Grade: ${student.Grade}, Classroom: ${student.Classroom}`));
                endTime = Date.now();
                console.log(`Search time: ${endTime - startTime}ms`);
                break;

            case 'q':
                rl.close();
                return;

            default:
                console.log('Invalid command.');
        }

        // Повертаємо підказку після виконання команди
        promptUser();
    });
}

// Запуск програми
promptUser();
