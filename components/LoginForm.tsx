import { useState } from 'react';
import { signIn } from '../lib/supabaseActions'; // Importing signIn from supabaseActions

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await signIn(email, password);

    if (error) {
      setError(error.message); // Display error if sign-in fails
    } else {
      // Successfully logged in, redirect or handle the login success
      alert('Logged in successfully');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
