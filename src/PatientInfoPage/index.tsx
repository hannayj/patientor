import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "semantic-ui-react";

import { Patient, Gender, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, getPatientInfo } from "../state";

const PatientInfoPage: React.FC = () => {
  const [{ patient }, dispatch] = useStateValue();
  const [{ diagnoses }] = useStateValue();
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

  const Entry: React.FC<{ entry: Entry }> = ({ entry }) => {
    return(
      <div>
        <p>{entry.date} <i>{entry.description}</i></p>
        <ul>
         {entry.diagnosisCodes?.map(c => {
           const diagnosis = diagnoses.filter(d => d.code === c)[0];
           return (
           <li key={c}>
             <span>{c}{" "} </span> 
             <span>{diagnosis.name}</span>
           </li>);
         })}
        </ul>
      </div>
    );

  };

  return (
    <div>
      <h2 >{patient?.name} <Icon name={iconForGender()} size="large" /></h2>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
      <h3>entries</h3>
      {patient?.entries.map(e => 
       <Entry key={e.id} entry={e}/>)}
    </div>
  );
};

export default PatientInfoPage;
