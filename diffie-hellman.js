const crypto = require('crypto'); 
  
const k = crypto.createDiffieHellman(1024); 

module.exports=k;
