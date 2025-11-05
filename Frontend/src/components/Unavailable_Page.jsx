import React from 'react'

function Unavailable_Page() {
    return (
        <div className='text-center s' style={{display:'flex',flexDirection:'column', alignItems: 'center', justifyContent:'center', minHeight:'65vh', minWidth: '100%', background:'transparent', padding:'1vh 1vw'}}>
            <h3 className='text-warning p-2'>Developing Phase</h3>
            <p className='text-light'> This feature will be available soon... </p>
        </div>
    )
}

export default Unavailable_Page