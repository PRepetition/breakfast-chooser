document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.select-btn');
    const result = document.getElementById('result');

    // Добавляем обработчик для чекбоксов "Без добавок"
    document.querySelectorAll('.additives').forEach(additivesContainer => {
        const checkboxes = additivesContainer.querySelectorAll('.additive-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.value === 'Без добавок' && checkbox.checked) {
                    // Если выбрано "Без добавок", снимаем выбор с других чекбоксов
                    checkboxes.forEach(cb => {
                        if (cb.value !== 'Без добавок') {
                            cb.checked = false;
                        }
                    });
                } else if (checkbox.value !== 'Без добавок' && checkbox.checked) {
                    // Если выбрана другая добавка, снимаем выбор с "Без добавок"
                    const noAdditiveCheckbox = additivesContainer.querySelector('input[value="Без добавок"]');
                    if (noAdditiveCheckbox) {
                        noAdditiveCheckbox.checked = false;
                    }
                }
            });
        });
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const dish = button.getAttribute('data-dish');
            const additivesContainer = button.parentElement.querySelector('.additives');
            const selectedAdditives = additivesContainer
                ? Array.from(additivesContainer.querySelectorAll('.additive-checkbox:checked'))
                    .map(checkbox => checkbox.value)
                    .filter(value => value !== 'Без добавок')
                : [];

            // Формируем сообщение для уведомления и Telegram
            const additivesText = selectedAdditives.length > 0
                ? ` с ${selectedAdditives.join(' и ')}`
                : '';
            result.textContent = `Выбрано: ${dish}${additivesText}! Я приготовлю это завтра утром!`;

            // Показываем уведомление
            result.classList.add('show');

            // Скрываем уведомление через 3 секунды
            setTimeout(() => {
                result.classList.remove('show');
            }, 3000);

            // Отправка в Telegram
            const token = config.token; 
            const chatId = config.chatId;
            const message = `Жена выбрала: ${dish}${additivesText}`;
            const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        console.log('Сообщение отправлено в Telegram!');
                    } else {
                        console.log('Ошибка:', data);
                    }
                })
                .catch(error => console.log('Ошибка:', error));
        });
    });
});
