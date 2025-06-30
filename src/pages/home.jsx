import React, { useState, useEffect } from "react";
import { PatternFormat } from "react-number-format";
import styles from "./home.module.css";

export default function Home() {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(120);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (!isLoading && !success) {
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [isLoading, success]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearInterval(intervalId);

    const url =
      "https://script.google.com/macros/s/AKfycbwkEd8EWtziTHDvA7BKP2Hz7_YLR3mHiFqtFbWWFRResIkeE6dnXCMjTQz1c15uWavH/exec";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `Name=${name}&Email=${number}`,
    })
      .then((res) => res.text())
      .then(() => {
        setIsLoading(false);
        setSuccess(true);
        setNumber("");
        setName("");
      })
      .catch((error) => {
        console.log("Xatolik:", error);
        setIsLoading(false);
      });
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.left}></div>
        <div className={styles.right}></div>

        <div className={styles.modalOverlay}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {!success ? (
              <>
                <p className={styles.information}>
                  Chegirmali xonadon sohibi bo‘lish uchun ma’lumotlaringizni
                  qoldiring!
                </p>
                <div className={styles.form}>
                  <div className={styles.inputs}>
                    <input
                      type="text"
                      placeholder="Ismingiz"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <PatternFormat
                      format="+998 ## ### ## ##"
                      allowEmptyFormatting
                      name="number"
                      mask=" "
                      value={number}
                      onValueChange={(values) =>
                        setNumber(values.formattedValue)
                      }
                      required
                      className={styles.contactInputPhone}
                      autoComplete="off"
                      placeholder="Telefon raqamingiz"
                    />
                  </div>
                  <div className={styles.submit}>
                    <button
                      className={number && name ? styles.activeButton : ""}
                      disabled={!number || !name}
                      onClick={handleSubmit}
                    >
                      Tasdiqlash
                    </button>
                    {!isLoading && (
                      <div className={styles.timer}>{formatTime(timer)}</div>
                    )}
                    {isLoading && <div className={styles.loader}></div>}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.successMessage}>
                <h3>Ma’lumotlaringiz muvaffaqiyatli yuborildi!</h3>
                <p>Ertaga sizni ofisimizda kutamiz 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
