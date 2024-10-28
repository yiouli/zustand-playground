import React, { useCallback } from 'react';
import './App.css';
import { useSuperDuperStore } from './store';
import { useShallow } from 'zustand/react/shallow'

// learnings:
// - changes to other properties do not trigger re-renders
// - subscription to setter function (regardless of nested or not) will not trigger re-render when unrelated properties are changed
// - subscription to getter function will not trigger re-render even if related properties in state are changed
// - useShallow prevents re-render from propagating when changes happens to unrelated part of the arrray

function StoreName() {
  const name = useSuperDuperStore(state => state.name);
  const changeStoreName = useSuperDuperStore(state => state.changeStoreName);
  console.log('StoreName render');

  return <input value={name} onChange={e => changeStoreName(e.target.value)} />;
}

function StoreDescription() {
  const description = useSuperDuperStore(state => state.description);
  const changeStoreDescription = useSuperDuperStore(state => state.changeStoreDescription);
  console.log('StoreDescription render');

  return <input value={description} onChange={e => changeStoreDescription(e.target.value)} />;
}

function StoreCount() {
  const count = useSuperDuperStore(state => state.count);
  const increment = useSuperDuperStore(state => state.increment);
  const decrement = useSuperDuperStore(state => state.fun.decrement);
  console.log('StoreCount render');

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <div>Count: {count}</div>
    </div>
  )
}

// this component does not re-render when count changes
function JustIncrement() {
  const increment = useSuperDuperStore(state => state.increment);

  console.log('JustIncrement render');
  return <button onClick={increment}>Increment</button>
}

function MemberAges() {
  const memberAges = useSuperDuperStore(useShallow(state => state.members.map(member => member.age)));
  console.log('MemberAges render');

  return <table>
    <thead>
      <tr>
        <th>Member</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      {memberAges.map((age, i) => (
        <tr key={i}>
          <td>Member {i + 1}</td>
          <td>{age}</td>
        </tr>
      ))}
    </tbody>
  </table>
}

function MemberNames() {
  const memberNames = useSuperDuperStore(useShallow(state => state.members.map(member => member.name)));
  console.log('MemberNames render');

  return <table>
    <thead>
      <tr>
        <th>Member</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      {memberNames.map((name, i) => (
        <tr key={i}>
          <td>Member {i + 1}</td>
          <td>{name}</td>
        </tr>
      ))}
    </tbody>
  </table>
}

// this component does not re-render when button is clicked
// meaning useShallow prevents change to name of the members array propagating to the subscription on ids
// also means that subscription to the setter function related to the array does not trigger re-render when the array is changed
function ChangeMemberName() {
  const memberIds = useSuperDuperStore(useShallow(state => state.members.map(member => member.id)));
  const changeMemberName = useSuperDuperStore(state => state.changeMemberName);
  const [selectedMemberId, setSelectedMemberId] = React.useState(memberIds[0]);
  const [newName, setNewName] = React.useState('');
  console.log('ChangeMemberName render');

  return <div>
    <select value={selectedMemberId} onChange={e => setSelectedMemberId(parseInt(e.target.value))}>
      {memberIds.map(id => (
        <option key={id} value={id}>Member {id}</option>
      ))}
    </select>
    <input type="text" placeholder="New Name" value={newName} onChange={e => setNewName(e.target.value)} />
    <button onClick={() => changeMemberName(selectedMemberId, newName)}>Change Name</button>
  </div>
}


function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
      <StoreName />
      <StoreDescription />
      <StoreCount />
      <JustIncrement />
      <MemberAges />
      <MemberNames />
      <ChangeMemberName />
    </div>
  );
}

export default App;
