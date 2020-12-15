
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../interfaces/user.interface';
import * as Yup from 'yup';
import http from '../../services/mirage/api'
import { saveToken, setAuthState } from './authSlice';
import { setUser } from './userSlice'
import { AuthResponse } from '../../services/mirage/routes/user';
import { useAppDispatch } from '../../store/store';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = Yup.object().shape({
  username: Yup.string().required('What? No Username?')
    .max(16, 'Username cannot be longer than 16 characters'),
  password: Yup.string().required('withput a password, "None Shall pass!"'),
  email: Yup.string().email('Please provide a vadlid email address!')

})


const Auth: FC = () => {
  const { handleSubmit, register, errors } = useForm<User>({
    resolver:yupResolver(schema)
  })
 
  const [isLogin,setIsLogin]=useState(true);
  const [loading,setloading]=useState(false);
  const dispatch=useAppDispatch()


  const submitForm=(data:User)=>{
    const path=isLogin? `/auth/login` : `/auth/signup`;
    http.post<User,AuthResponse>(path,data).then((res)=>{
      if(res){
        const {user,token} =res;
      dispatch(saveToken(token));
      dispatch(setUser(user));
      dispatch(setAuthState(true));

      }
    }).catch((error)=>{
      console.log(error)
    })
    .finally(()=>{
      setloading(false)
    })
  }
    

  return(
    <div className="auth">
      <div className="card">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="inputWrapper">
            <input ref={register} name="username" placeholder="Username" />
            {errors && errors.username && (
              <p className="error">{errors.username.message}</p>
            )}
          </div>
          <div className="inputWrapper">
            <input
              ref={register}
              name="password"
              type="password"
              placeholder="Password"
            />
            {errors && errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          {!isLogin && (
            <div className="inputWrapper">
              <input
                ref={register}
                name="email"
                placeholder="Email (optional)"
              />
              {errors && errors.email && (
                <p className="error">{errors.email.message}</p>
              )}
            </div>
          )}
          <div className="inputWrapper">
            <button type="submit" disabled={loading}>
              {isLogin ? 'Login' : 'Create account'}
            </button>
          </div>
          <p
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: 'pointer', opacity: 0.7 }}
          >
            {isLogin ? 'No account? Create one' : 'Already have an account?'}
          </p>
        </form>
      </div>
    </div>
  )

}


export default Auth;