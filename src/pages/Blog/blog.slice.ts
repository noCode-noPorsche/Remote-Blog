import { Post } from 'types/blog.types'
import { createSlice, current, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { initalPostList } from 'constants/blog'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: initalPostList,
  editingPost: null
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        const post = action.payload
        state.postList.push(post)
      },
      prepare: (post: Omit<Post, 'id'>) => ({
        payload: {
          ...post,
          id: nanoid()
        }
      })
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      state.postList = state.postList.filter((post) => post.id !== postId)
    },
    startEditingPost: (state, action) => {
      const postId = action.payload
      state.editingPost = state.postList.find((post) => post.id === postId) || null
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    },
    finishEditingPost: (state, action: PayloadAction<Post>) => {
      const postId = action.payload.id
      const indexPost = state.postList.findIndex((post) => post.id === postId)
      if (indexPost !== -1) {
        state.postList[indexPost] = action.payload
      }
      state.editingPost = null
    }
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state, action) => {
          console.log(current(state))
        }
      )
      .addDefaultCase((state, action) => {
        console.log(`action type: ${action.type}`, current(state))
      })
  }
})

export const { addPost, deletePost, startEditingPost, cancelEditingPost, finishEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer

export default blogReducer
