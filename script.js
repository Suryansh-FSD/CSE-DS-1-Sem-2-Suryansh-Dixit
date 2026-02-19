document.getElementById('toggle-modules').addEventListener('click', function() {
    var modulesList = document.getElementById('modules-list');
    if (modulesList.style.display === 'none') {
        modulesList.style.display = 'block';
    } else {
        modulesList.style.display = 'none';
    }
});
