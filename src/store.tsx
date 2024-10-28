import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface Member {
  id: number
  name: string
  age: number
}

interface Job {
  id: number
  description: string
  assignments: number[]
}

interface Store {
  count: number
  name: string
  description: string
  // array
  members: Member[]
  union: {
    // nested property
    president: number
    // nested array
    members: number[]
    // nested object arrray
    jobs: Job[]
  }
  increment: () => void
  changeStoreName: (name: string) => void
  changeStoreDescription: (description: string) => void
  addMember: (name: string) => void
  changeMemberName: (id: number, name: string) => void
  fun: {
    decrement: () => void
    removeMember: (id: number) => void
    changeAge: (id: number, age: number) => void
    addMemberToUnion: (id: number) => void
    assignJob: (jobId: number, memberId: number) => void
  }
}

export const useSuperDuperStore = create<Store>()(
  devtools(subscribeWithSelector(immer(
    (set, get) => ({
      count: 0,
      name: 'Super-duper Store',
      description: 'This is the best store ever',
      members: [
        { id: 1, name: 'Alice', age: 23 },
        { id: 2, name: 'Bob', age: 34 },
        { id: 3, name: 'Charlie', age: 45 },
        { id: 4, name: 'David', age: 56 },
      ],
      union: {
        president: 1,
        members: [1, 2, 3],
        jobs: [
          { id: 1, description: 'Job 1', assignments: [1, 2] },
          { id: 2, description: 'Job 2', assignments: [3] },
        ],
      },
      increment: () => set(state => void state.count++),
      changeStoreName: name => set(state => void (state.name = name)),
      changeStoreDescription: description => set(state => void (state.description = description)),
      addMember: name => set(state => void state.members.push({ id: state.members.length + 1, name, age: 0 })),
      changeMemberName: (id, name) => set(state => void (state.members.find(m => m.id === id)!.name = name)),
      fun: {
        decrement: () => set(state => void state.count--),
        removeMember: id => set(state => void state.members.splice(state.members.findIndex(m => m.id === id), 1)),
        changeAge: (id, age) => set(state => void (state.members.find(m => m.id === id)!.age = age)),
        addMemberToUnion: id => set(state => void state.union.members.push(id)),
        assignJob: (jobId, memberId) => set(state => void state.union.jobs.find(j => j.id === jobId)!.assignments.push(memberId)),
      },
    })
  )))
)
