export const canActive = (_, from, next) =>{
    if (!localStorage.getItem('token')) return next({ path: from.path });
  
    return next();
}
