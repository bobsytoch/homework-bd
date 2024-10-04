import fs from 'fs';
import readline from 'readline';
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// type Student = {
// 	last: string
// 	first: string
// 	grade: number
// 	classroom: number
// 	bus: number
// }

// type Teacher = {
// 	last: string
// 	first: string
// 	classroom: number
// }

const students = fs.readFileSync('list.txt', 'utf-8').split('\n').map(line => {
	const [last, first, grade, classroom, bus] = line.split(',').map(x => x.trim());
	return { last, first, grade: +grade, classroom: +classroom, bus: +bus };
});

const teachers = fs.readFileSync('teachers.txt', 'utf-8').split('\n').map(line => {
	const [last, first, classroom] = line.split(',').map(x => x.trim());
	return { last, first, classroom: +classroom };
});

const findStudentByLastName = (lastname: string) => 
	students.filter(student => student.last.toLowerCase() === lastname.toLowerCase())

const findBusRouteByStudent = (lastname: string, bus: number) => 
	students.filter(student => student.last.toLowerCase() === lastname.toLowerCase() && student.bus == bus);

const findStudentsByTeacher = (lastname: string) => 
	findTeachersByLastName(lastname).map(v => findStudentsByClassroom(v.classroom).map(s => ({ ...s, tfirst: v.first, tlast: v.last }))).flat(1);

const findStudentsByClassroom = (classroom: number) => 
	students.filter(student => student.classroom === classroom);

const findStudentsByBusRoute = (bus: number) =>  
	students.filter(student => student.bus === bus);

const findStudentsByGrade = (grade: number) =>
	students.filter(student => student.grade == grade);

const findTeachersByClasroom = (clasroom: number) => 
	teachers.filter(teacher => teacher.classroom == clasroom);

const findTeachersByLastName = (lastname: string) => 
	teachers.filter(teacher => teacher.last.toLowerCase() == lastname.toLowerCase());

const findTeachersByGrade = (grade: number) =>
	students.filter(student => student.grade == grade).map(s => findTeachersByClasroom(s.classroom).map(v => ({...v, grade: s.grade, sfirst: s.first, slast: s.last }))).flat(1);

function promptUser() {
	rl.question('Enter command. [S/T/C/B/G/Q]: ', (input) => {
		const [command, arg1, arg2] = input.split(' ');
		
		let startTime, endTime;
		if (!command) console.log('ERROR! You\'re required to enter a command.')
		else if (command !== 'Q' && !arg1) console.log('ERROR! Each command requires supplemental info. Here\'s each one:\nS[tudents] <lastname> (number); T[eacher] <lastname>; C[lassroom] <number> (T); B[us] <number>; G[rade] <number> (T)');
		else switch (command.toLowerCase()) {
			case 's': 
				startTime = Date.now();
				((!arg2 || isNaN(+arg2)) 
					? findStudentByLastName(arg1) 
					: findBusRouteByStudent(arg1, +arg2))
					.forEach(student => console.log(`${student.first} ${student.last} - Grade: ${student.grade}, Classroom: ${student.classroom}, Bus: ${student.bus}`));
				endTime = Date.now();
				console.log(`Search time: ${endTime - startTime}ms`);
				break;
			case 't':
				startTime = Date.now();
				findStudentsByTeacher(arg1)
					.forEach(student => console.log(`Teacher: ${student.tfirst} ${student.tlast}, Student: ${student.first} ${student.last} - Grade: ${student.grade}, Classroom: ${student.classroom}, Bus: ${student.bus}`));
				endTime = Date.now();
				console.log(`Search time: ${endTime - startTime}ms`);
				break;
			case 'c':
				startTime = Date.now();
				((arg2 == 'T')
					? findTeachersByClasroom(parseInt(arg1))
					: findStudentsByClassroom(parseInt(arg1)))
					.forEach(student => console.log(`Class: ${arg1}: ${student.first} ${student.last}`));
				endTime = Date.now();
				console.log(`Search time: ${endTime - startTime}ms`);
				break;

			case 'b':
				startTime = Date.now();
				findStudentsByBusRoute(parseInt(arg1))
					.forEach(student => console.log(`Bus: ${student.bus} Student: ${student.first} ${student.last} - Grade: ${student.grade}, Classroom: ${student.classroom}`));
				endTime = Date.now();
				console.log(`Search time: ${endTime - startTime}ms`);
				break;

			case 'g':
				startTime = Date.now();
				if (arg2 == 'T') findTeachersByGrade(parseInt(arg1))
					.forEach(student => console.log(`Grade: ${student.grade} Teacher: ${student.first} ${student.last} Student: ${student.sfirst} ${student.slast} `))
				else findStudentsByGrade(parseInt(arg1))
					.forEach(student => console.log(`Grade: ${student.grade} Student: ${student.first} ${student.last}`))
				endTime = Date.now();
				console.log(`Search time: ${endTime - startTime}ms`);
				break;
			case 'q': return rl.close();

			default: console.log('Invalid command.');
		}

		promptUser();
	});
}

promptUser();
