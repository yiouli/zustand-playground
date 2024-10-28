import React, { useCallback } from 'react';
import './App.css';
import { useSuperDuperStore } from './store';
import { useShallow } from 'zustand/react/shallow'

// learnings:
// - subscription with selector determines whether to trigger rerender base on shallow equality of the return value
//   - subscription to properties will not trigger re-render when unrelated properties are changed
// - subscription with useShallow will do shallow comparison of top level properties (or items in array) to determine if re-render is needed
// - subscription to a computed value that returns nested object (array of obj, obj of obj, obj of arrray etc) will always trigger rerender even with useShallow
// - subscription to setter function (regardless of nested or not) will not trigger re-render when state changes

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
  // in v5 removing useShallow will cause max update depth exceeded error, but in v4.5.2 it doesn't
  // in v4.5.2, without useShallow, the component will re-render when unrelated properties are changed
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

function MemberAgesInListOfObj() {
  // regardless of useShallow, changes to unrelated property will trigger rerender with the subscription that creates objects
  // in v5 this will cause max update depth exceeded error
  const memberAgesInListOfObj = useSuperDuperStore(useShallow(state => state.members.map(member => ({ age: member.age }))));
  console.log('MemberAges (list of obj) render');

  return <table>
    <thead>
      <tr>
        <th>Member</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      {/* {memberAges.map((age, i) => ( */}
      {memberAgesInListOfObj.map(({ age }, i) => (
        <tr key={i}>
          <td>Member {i + 1}</td>
          <td>{age}</td>
        </tr>
      ))}
    </tbody>
  </table>
}

function MemberAgesInObj() {
  // useShallow prevents re-render from propagating when changes happens to unrelated part of the state (including other fields of the array)
  // in v5 removing useShallow will cause max update depth exceeded error, but in v4.5.2 it doesn't
  // in v4.5.2, without useShallow, the component will re-render when unrelated properties are changed
  const memberAgesInObj = useSuperDuperStore(useShallow(state => {
    let ret: { [id: string]: number } = {};
    for (let i = 0; i < state.members.length; i++) {
      ret[i.toString()] = state.members[i].age;
    }
    return ret;
  }));
  console.log('MemberAges (obj) render');

  return <table>
    <thead>
      <tr>
        <th>Member</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(memberAgesInObj).map(([id, age]) => (
        <tr key={id}>
          <td>Member {parseInt(id) + 1}</td>
          <td>{age}</td>
        </tr>
      ))}
    </tbody>
  </table>
}

function MemberAgesInObjOfObj() {
  // regardless of useShallow, changes to unrelated property will trigger rerender with the subscription that creates objects
  // in v5 this will cause max update depth exceeded error
  const memberAgesInObjOfObj = useSuperDuperStore(useShallow(state => {
    let ret: { [id: string]: { age: number } } = {};
    for (let i = 0; i < state.members.length; i++) {
      ret[i.toString()] = { age: state.members[i].age };
    }
    return ret;
  }));
  console.log('MemberAges (obj of obj) render');

  return <table>
    <thead>
      <tr>
        <th>Member</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(memberAgesInObjOfObj).map(([id, { age }]) => (
        <tr key={id}>
          <td>Member {parseInt(id) + 1}</td>
          <td>{age}</td>
        </tr>
      ))}
    </tbody>
  </table>
}

function MemberAgesInObjOfList() {
  // regardless of useShallow, changes to unrelated property will trigger rerender with the subscription that creates objects
  // in v5 this will cause max update depth exceeded error
  const memberAgesInObjOfArray = useSuperDuperStore(useShallow(state => {
    let ret: { [id: string]: number[] } = {};
    for (let i = 0; i < state.members.length; i++) {
      ret[i.toString()] = [state.members[i].age];
    }
    return ret;
  }));
  console.log('MemberAges (obj of list) render');

  return <table>
    <thead>
      <tr>
        <th>Member</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(memberAgesInObjOfArray).map(([id, [age]]) => (
        <tr key={id}>
          <td>Member {parseInt(id) + 1}</td>
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


function UnionName() {
  const name = useSuperDuperStore(state => state.union.name);
  const changeUnionName = useSuperDuperStore(state => state.fun.changeUnionName);
  console.log('UnionName render');

  return <input value={name} onChange={e => changeUnionName(e.target.value)} />;
}

function UnionDescription() {
  const description = useSuperDuperStore(state => state.union.description);
  const changeUnionDescription = useSuperDuperStore(state => state.fun.changeUnionDescription);
  console.log('UnionDescription render');

  return <input value={description} onChange={e => changeUnionDescription(e.target.value)} />;
}

function UnionMembers() {
  const memberIds = useSuperDuperStore(state => state.union.members);

  return <div>
    <h2>Union Members</h2>
    <ul>
      {memberIds.map(id => (
        <li key={id}>Member {id}</li>
      ))}
    </ul>
  </div>
}

function UnionJobs() {
  const jobs = useSuperDuperStore(state => state.union.jobs);

  return <div>
    <h2>Union Jobs</h2>
    <ul>
      {jobs.map(job => (
        <li key={job.id}>{job.description}</li>
      ))}
    </ul>
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
      <MemberAgesInListOfObj />
      <MemberAgesInObj />
      <MemberAgesInObjOfObj />
      <MemberAgesInObjOfList />
      <MemberNames />
      <ChangeMemberName />
      <UnionName />
      <UnionDescription />
      <UnionMembers />
      <UnionJobs />
    </div>
  );
}

export default App;
