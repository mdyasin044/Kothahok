import ActiveList from './ActiveList';
import VideoChat from './VideoChat';
import TextChat from './TextChat';
import TaskBar from './TaskBar';
import './Room.css'

const Room = () => {
    return (
        <div className="Room">
            <ActiveList />
            <div className='VideoChatAndTaskBar'>
                <VideoChat />
                <TaskBar />
            </div>
            <TextChat />
        </div>
    );
}

export default Room