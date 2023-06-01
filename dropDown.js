const dropDownBtn = document.querySelectorAll('[data-drop-down-button]');
// const dropDownMenu = document.querySelectorAll('dropdown-menu');

dropDownBtn.forEach((btn)=>{
    btn.addEventListener('click', function(){
        const showMenu = btn.parentElement;      
      const isOpen = showMenu.classList.contains('active');

      closeAllDropdowns();

      if(!isOpen){
        showMenu.classList.add('active');
      }
    })
})


function closeAllDropdowns(){
   dropDownBtn.forEach((btn)=>{
    btn.parentElement.classList.remove('active');
   })
}