function ready(fn){
  if(document.readyState == 'complete'){
    fn(); 
  }

  document.addEventListener('DOMContentLoaded', fn, false);
}
