document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const item = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value
    };

    await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });

    loadItems();
    e.target.reset();
});

async function loadItems() {
    const response = await fetch('/api/items');
    const items = await response.json();
    const itemsList = document.getElementById('itemsList');
    
    itemsList.innerHTML = items.map(item => `
        <div class="item">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button onclick="deleteItem('${item._id}')">Delete</button>
        </div>
    `).join('');
}

async function deleteItem(id) {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    loadItems();
}

loadItems();
