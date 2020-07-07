import React from 'react';
import AdminHome from './home/AdminHome';

export default function ({ token }) {
  return (
    <AdminHome token={token} />
  );
}