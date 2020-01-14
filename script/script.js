document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const customer = document.getElementById('customer');
    const freelancer = document.getElementById('freelancer');
    const blockChoice = document.getElementById('block-choice');
    const blockCustomer = document.getElementById('block-customer');
    const blockFreelancer = document.getElementById('block-freelancer');
    const btnExit = document.getElementById('btn-exit');
    const formCustomer = document.getElementById('form-customer');
    const ordersTable = document.getElementById('orders');
    const modalOrder = document.getElementById('order_read');
    const modalOrderActive = document.getElementById('order_active');
    const headTable = document.getElementById('headTable');

    const orders = JSON.parse(localStorage.getItem('freeOrders')) || []; // массив заказов


    const toStorage = () => {
        localStorage.setItem('freeOrders', JSON.stringify(orders));
    }

    //численное склонение слов, передать число и массив мз трех элементов ['день', 'дня', 'дней']
    const declOfNum = (number, titles) => number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ?
        2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];

    const calcDeadline = (deadline) => {
        const todayDate = new Date();
        const deadlineDate = new Date(deadline);
        const diffDate = Math.abs(deadlineDate - todayDate) / 1000 / 3600;
        const day = Math.floor(diffDate);
        if (Math.floor(day / 24) >= 2) {
            return declOfNum(Math.floor(day / 24), ['день', 'дня', 'дней']);
        }
        return declOfNum(Math.floor(day), ['час', 'часа', 'часов']);
    }

    const renderOrders = () => {
        ordersTable.textContent = '';

        orders.forEach((order, i) => {
            ordersTable.innerHTML += `
            <tr class="order ${order.active ? 'active' : ''}" data-number-order="${i}">
                <td>${i + 1}</td>
                <td>${order.title}</td>
                <td class="${order.currency}"></td>
                <td>${calcDeadline(order.deadline)}</td>
            </tr>
            `;
        })
    };


    const handlerModal = (event) => {
        const target = event.target;
        const modal = target.closest('.order-modal');
        const order = orders[modal.numberOrder];


        if (target.closest('.close') || target === modal) {
            modal.style.display = 'none';
        }

        const baseSettings = () => {
            toStorage();
            renderOrders();
            modal.style.display = 'none';
        }

        if (target.classList.contains('get-order')) {
            order.active = true;
            baseSettings()
        }

        if (target.id === 'capitulation') {
            order.active = false;
            baseSettings()
        }

        if (target.id === 'ready') {

            orders.splice(orders.indexOf(order), 1);
            baseSettings()
        }


    };

    const openModal = (numberOrder) => {
        const order = orders[numberOrder];

        const {
            title,
            firstName,
            email,
            phone,
            description,
            amount,
            currency,
            deadline,
            active = false
        } = order;

        const modal = active ? modalOrderActive : modalOrder;

        const modalTitleBlock = modal.querySelector('.modal-title');
        const firstNameBlock = modal.querySelector('.firstName');
        const emailBlock = modal.querySelector('.email');
        const descriptionBlock = modal.querySelector('.description');
        const deadlineBlock = modal.querySelector('.deadline');
        const currencyBlock = modal.querySelector('.currency_img');
        const countBlock = modal.querySelector('.count');
        const phoneBlock = modal.querySelector('.phone');

        const modalCloseBtn = modal.querySelector('.close');
        const modalGetOrderBtn = modal.querySelector('.get-order');


        modal.numberOrder = numberOrder;

        modalTitleBlock.textContent = title;
        firstNameBlock.textContent = firstName;
        emailBlock.textContent = email;
        emailBlock.href = 'mailto:' + email;
        descriptionBlock.textContent = description;
        deadlineBlock.textContent = deadline;
        countBlock.textContent = amount;
        currencyBlock.className = 'currency_img';
        currencyBlock.classList.add(currency);
        phoneBlock && (phoneBlock.href = 'tel:' + phone);


        modal.style.display = 'flex';

        modal.addEventListener(('click'), handlerModal);


    };

    ordersTable.addEventListener('click', (event) => {
        const target = event.target;
        const targetOrder = target.closest('.order');
        if (targetOrder) {
            openModal(targetOrder.dataset.numberOrder);
        }


    });


    customer.addEventListener('click', () => {
        blockChoice.style.display = 'none';

        const currentDate = new Date();
        const new_value = currentDate.toISOString().substring(0, 10);
        document.getElementById("deadline").value = new_value;
        document.getElementById("deadline").min = new_value;

        blockCustomer.style.display = 'block';
        btnExit.style.display = 'block';

    });

    freelancer.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        renderOrders();
        blockFreelancer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    btnExit.addEventListener('click', () => {
        blockFreelancer.style.display = 'none';
        blockCustomer.style.display = 'none';
        btnExit.style.display = 'none';
        blockChoice.style.display = 'block';
    });

    const sortOrder = (arr, property) => {
        arr.sort((a, b) => a[property] > b[property] ? 1 : -1);
    };

    headTable.addEventListener(('click'), (event) => {
        const target = event.target;

        if (target.classList.contains('head-sort')) {
            if (target.id === 'taskSort') {
                console.log(target.id);
                sortOrder(orders, 'title');
            }

            if (target.id === 'currencySort') {
                console.log(target.id);
                sortOrder(orders, 'currency');
            }

            if (target.id === 'deadlineSort') {
                console.log(target.id);
                sortOrder(orders, 'deadline');
            }
            toStorage();
            renderOrders();
        }
    });

    formCustomer.addEventListener('submit', (event) => {
        event.preventDefault(); // заблокировать кнопку Submit
        const obj = {};

        const elements = [...formCustomer.elements]
            .filter((elem) => (elem.tagName === 'INPUT' && elem.type !== 'radio' ||
                (elem.type === 'radio' && elem.checked) || elem.tagName === 'TEXTAREA'));

        elements.forEach((elem) => {
            obj[elem.name] = elem.value;
        });

        formCustomer.reset();

        orders.push(obj);
        toStorage();
        // console.log(orders);


    })
})