import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "semantic-ui-react";

import { Patient, Gender } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, getPatientInfo } from "../state";

const PatientInfoPage: React.FC = () => {
  const [{ patient }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>(); 

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientInfo } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(getPatientInfo(patientInfo));
      } catch (e) {
        console.error(e.response?.data || 'Unknown Error');
      }
    };
    if (!patient || patient?.id !== id) {
      void fetchPatient();
    }
  }, [dispatch, id, patient]);

  const iconForGender = () => {
    if (patient?.gender === Gender.Male) {
      return "mars";
    } else if (patient?.gender === Gender.Female) {
      return "venus";
    } else {
      return "other gender";
    }
  }; 

  return (
    <div>
      <h2 >{patient?.name} <Icon name={iconForGender()} size="large" /></h2>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p> 
    </div>
  );
};

export default PatientInfoPage;
