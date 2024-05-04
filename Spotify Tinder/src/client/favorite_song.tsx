import './favorites.css'
function favoriteSong({song, delete: deleteFn}:{song:any, delete: (id:string) => void}){

return(
    <div className='song'>
    <div>
        <img src={song.album.images[0].url} width={50} height={50}/>
    </div>
    <div className='title'>
         <p>{song.name}</p>
         <p>{song.artists.name}</p>
    </div>
    <div>
        <button onClick={() => deleteFn(song.id)}>
            Delete
        </button>
    </div>
    </div>
)

}

export default favoriteSong