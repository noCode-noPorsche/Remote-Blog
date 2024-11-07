import { createAsyncThunk, createSlice, current, nanoid } from '@reduxjs/toolkit'
import { Post } from 'types/blog.types'
import http from 'utils/http'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: [],
  editingPost: null
}

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
  const response = await http.get<Post[]>('posts', { signal: thunkAPI.signal })
  return response.data
})

export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
  const response = await http.post<Post>('posts', body, { signal: thunkAPI.signal })
  return response.data
})

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    const response = await http.put<Post>(`posts/${postId}`, body, { signal: thunkAPI.signal })
    return response.data
  }
)

export const deletePost = createAsyncThunk('blog/deletePost', async (postId: string, thunkAPI) => {
  const response = await http.delete<Post>(`posts/${postId}`, { signal: thunkAPI.signal })
  return response.data
})

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // addPost: {
    //   reducer: (state, action: PayloadAction<Post>) => {
    //     const post = action.payload
    //     state.postList.push(post)
    //   },
    //   prepare: (post: Omit<Post, 'id'>) => ({
    //     payload: {
    //       ...post,
    //       id: nanoid()
    //     }
    //   })
    // },
    // deletePost: (state, action: PayloadAction<string>) => {
    //   const postId = action.payload
    //   state.postList = state.postList.filter((post) => post.id !== postId)
    // },
    startEditingPost: (state, action) => {
      const postId = action.payload
      state.editingPost = state.postList.find((post) => post.id === postId) || null
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    }
    // finishEditingPost: (state, action: PayloadAction<Post>) => {
    //   const postId = action.payload.id
    //   const indexPost = state.postList.findIndex((post) => post.id === postId)
    //   if (indexPost !== -1) {
    //     state.postList[indexPost] = action.payload
    //   }
    //   state.editingPost = null
    // }
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        console.log("Payload received in addPost:", action.payload); // kiểm tra payload

        state.postList.push(action.payload)
        // prepare: (post: Post) => ({
        //   payload: { ...post, id: nanoid() }
        // })
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, index) => {
          if (post.id === action.payload.id) {
            state.postList[index] = action.payload
            return true
          }
          return false
        })
        state.editingPost = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.meta.arg
        const deletePostIndex = state.postList.findIndex((post) => post.id === postId)
        if (deletePostIndex !== -1) {
          state.postList.splice(deletePostIndex, 1)
        }
      })
      // .addMatcher(
      //   (action) => action.type.includes('cancel'),
      //   (state, action) => {
      //     console.log(current(state))
      //   }
      // )
      // .addDefaultCase((state, action) => {
      //   console.log(`action type: ${action.type}`, current(state))
      // })
  }
})

// export const { addPost, deletePost, startEditingPost, cancelEditingPost, finishEditingPost } = blogSlice.actions
export const { startEditingPost, cancelEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer

export default blogReducer
