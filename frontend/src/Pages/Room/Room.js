
import ActiveList from './ActiveList';
import VideoChat from './VideoChat';
import TextChat from './TextChat';
import './Room.css'

const Room = () => {
    return (
        <div className="Room">
            <ActiveList />
            <VideoChat />
            <TextChat />
        </div>
    );
}

export default Room