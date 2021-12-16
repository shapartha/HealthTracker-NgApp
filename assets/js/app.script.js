function addDataSection(toggleMode) {
    var addBtnSec = document.getElementById('add-data-section-btn');
    if (toggleMode === 'HIDE') {
        addBtnSec.style.display = 'none';
    } else {
        addBtnSec.style.display = 'inline-block';
        addBtnSec.click();
    }
}