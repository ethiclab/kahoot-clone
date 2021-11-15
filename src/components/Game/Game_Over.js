import React from 'react';
import {Link} from 'react-router-dom';
import Zoom from '../../components/animations/zoomin.js';
import './Game.css';


export default function GameOver(props){
    return(
        <div className='game-over'>
            <Zoom/>
            <h1 className='leaderBoard-title'>Game Over</h1>
            <br/>
            { props.leaderboard.length > 0 &&
            <h2 className='leaderBoard'>1st Place: {props.leaderboard[0].name}</h2>
            }
            { props.leaderboard.length > 1 &&
            <h2 className='leaderBoard'>2nd Place: {props.leaderboard[1].name}</h2>
            }
            { props.leaderboard.length > 2 &&
            <h2 className='leaderBoard'>3rd Place: {props.leaderboard[2].name}</h2>
            }
            <br/>
            <Link to='/host'>
            <button className='btn-newGame'>
            Start a new Game?
            </button>
            </Link>
        </div> 
    )
}