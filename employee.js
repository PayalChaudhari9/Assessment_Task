document.addEventListener('DOMContentLoaded', () => {
    const apiEndpoint = 'https://dummy.restapiexample.com/api/v1';
    const empTable = document.getElementById('empTable').getElementsByTagName('tbody')[0];
    const empForm = document.getElementById('empForm');
    let empList = [];

    // Fetch and display all employees
    const getEmployees = async () => {
        const response = await fetch(`${apiEndpoint}/employees`);
        const data = await response.json();
        empList = data.data;
        renderEmployees();
    };

    // Display employees in the table
    const renderEmployees = () => {
        empTable.innerHTML = '';
        empList.forEach(emp => {
            const row = empTable.insertRow();
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.employee_name}</td>
                <td>${emp.employee_salary}</td>
                <td>${emp.employee_age}</td>
                <td>
                    <button onclick="editEmployee(${emp.id})">Edit</button>
                    <button onclick="removeEmployee(${emp.id})">Delete</button>
                </td>
            `;
        });
    };

    // Fetch single employee details
    const getEmployee = async (id) => {
        const response = await fetch(`${apiEndpoint}/employee/${id}`);
        const data = await response.json();
        return data.data;
    };

    // Create a new employee
    empForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newEmp = {
            name: document.getElementById('empName').value,
            salary: document.getElementById('empSalary').value,
            age: document.getElementById('empAge').value
        };
        const response = await fetch(`${apiEndpoint}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEmp)
        });
        const data = await response.json();
        empList.push(data.data);
        renderEmployees();
        empForm.reset();
    });

    // Edit employee details
    window.editEmployee = async (id) => {
        const emp = await getEmployee(id);
        document.getElementById('empName').value = emp.employee_name;
        document.getElementById('empSalary').value = emp.employee_salary;
        document.getElementById('empAge').value = emp.employee_age;
        empForm.onsubmit = async (event) => {
            event.preventDefault();
            emp.employee_name = document.getElementById('empName').value;
            emp.employee_salary = document.getElementById('empSalary').value;
            emp.employee_age = document.getElementById('empAge').value;
            const response = await fetch(`${apiEndpoint}/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emp)
            });
            const data = await response.json();
            empList = empList.map(e => e.id === id ? data.data : e);
            renderEmployees();
            empForm.reset();
            empForm.onsubmit = createEmployee;
        };
    };

    // Delete employee
    window.removeEmployee = async (id) => {
        await fetch(`${apiEndpoint}/delete/${id}`, { method: 'DELETE' });
        empList = empList.filter(emp => emp.id !== id);
        renderEmployees();
    };

    // Initialize the page by fetching and displaying employees
    getEmployees();
});
