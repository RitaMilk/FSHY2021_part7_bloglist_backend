const arrStart= ['60affbb38f1a472fd43bd4fa','60affbdd357ddb1c8cca2bdb']
console.log('arrStart',arrStart)
const stringToExclude='60affbb38f1a472fd43bd4fa'
const arrEnd=arrStart.filter(item => {return(item!==stringToExclude)})
console.log('arrEnd',arrEnd)
