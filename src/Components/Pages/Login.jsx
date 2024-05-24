import React, { useState, useContext, useEffect } from "react";
import { Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HashLoader } from 'react-spinners';
import { AuthContext } from "../AppContext/AppContext";
import { auth, onAuthStateChanged } from "../firebase/firebase";
import logoLogin from "../../assets/images/logoLogin.png";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, loginWithEmailAndPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .required("Required")
      .min(6, "Must be at least 6 characters long")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, "Password must contain letters and at least one number"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        await loginWithEmailAndPassword(values.email, values.password);
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please check your email and password.");
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <HashLoader color="#0866ff" size={100} speedMultiplier={1} />
        </div>
      ) : (
        <div className="flex h-screen justify-center items-center bg-bgLogin">
          <div className="flex justify-between w-full max-w-6xl">
            <div className="flex items-center justify-center w-1/2">
              <img src={logoLogin} alt="Logo" className="h-30" />
            </div>
            <div className="flex items-center justify-center w-1/2">
              <Card className="w-96">
                <CardBody className="flex flex-col gap-4">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-2">
                      <Input
                        name="email"
                        type="email"
                        label="Email"
                        size="lg"
                        {...formik.getFieldProps("email")}
                      />
                    </div>
                    <div>
                      {formik.touched.email && formik.errors.email && (
                        <Typography variant="small" color="red">
                          {formik.errors.email}
                        </Typography>
                      )}
                    </div>
                    <div className="mt-4 mb-2 pb-2">
                      <Input
                        name="password"
                        type="password"
                        label="Password"
                        size="lg"
                        {...formik.getFieldProps("password")}
                      />
                      <div>
                        {formik.touched.password && formik.errors.password && (
                          <Typography variant="small" color="red">
                            {formik.errors.password}
                          </Typography>
                        )}
                      </div>
                    </div>
                    <Button
                      fullWidth
                      className="bg-btn"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      Login
                    </Button>
                  </form>
                </CardBody>
                <CardFooter className="pt-0">
                  <Button
                    fullWidth
                    className="mb-4 bg-btn"
                    onClick={signInWithGoogle}
                  >
                    Sign In with Google
                  </Button>
                  <Link to="/reset">
                    <p className="ml-1 font-bold font-roboto text-sm text-btn text-center">
                      Reset the password
                    </p>
                  </Link>
                  <div className="mt-6 flex items-center font-roboto text-base justify-center">
                    Don't have an account?
                    <Link to="/register">
                      <p className="ml-1 font-bold font-roboto text-sm text-btn text-center">
                        Register
                      </p>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
