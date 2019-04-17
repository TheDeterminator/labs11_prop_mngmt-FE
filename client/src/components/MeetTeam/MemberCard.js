import React from 'react';
import { Card, CardTitle } from 'react-materialize';

const randomOrder = () => Math.floor(Math.random() * 10);
const imgstyle = { width: '200px', height: '200px' };

const MemberCard = ({ name, src, content, gitHub, linkedIn }) => {
  const firstName = name.split(' ')[0].toLowerCase();
  return (
    <div
      className={firstName}
      style={{
        margin: '15px',
        width: '310px',
        display: 'inline-block',
        order: randomOrder()
      }}
    >
      <Card
        className="cyan lighten-4"
        style={{ margin: '15px' }}
        header={<CardTitle />}
        title={name}
        reveal={
          <p style={{ marginTop: '30px', textAlign: 'left' }}>{content}</p>
        }
      >
        <img style={imgstyle} src={src} alt={firstName} />
        <p>
          <a target="_blank" rel="noopener noreferrer" href={gitHub}>
            <i
              style={{ color: 'black', margin: '10px' }}
              class="fab fa-github-square fa-2x"
            />
          </a>
          <a target="_blank" rel="noopener noreferrer" href={linkedIn}>
            <i
              style={{ color: ' #0077B5' }}
              className="fab fa-linkedin fa-2x"
            />
          </a>
        </p>
      </Card>
    </div>
  );
};

export default MemberCard;
