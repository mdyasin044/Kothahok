import "./Home.css"

const Home = () => {
    return (
      <div className="Home">
        <div className="Box">
          <div>
              Enter your name
              <input />
          </div>
          <div>
              <button>Create Room</button>
              <input />
              <button>Join Room</button>
          </div>
        </div>
      </div>
    );
}

export default Home