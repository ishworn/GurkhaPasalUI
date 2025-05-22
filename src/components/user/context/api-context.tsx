"use client";

import React, { createContext, useContext, useState } from "react";

type ApiContextType = {
  get: (url: string) => Promise<any>;
  post: (url: string, data: any) => Promise<any>;
  put: (url: string, data: any) => Promise<any>;
  token?: string;
  setToken: (token: string) => void;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | undefined>(undefined);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  const get = async (url: string) => {
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return await res.json();
  };

  const post = async (url: string, data: any) => {
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  };

  const put = async (url: string, data: any) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  };

  return (
    <ApiContext.Provider value={{ get, post, put, token, setToken }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used inside ApiProvider");
  }
  return context;
};
