import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMenuSelector } from '../../../context/Menu'
import { fetchAllResumesThunk } from '../../../store/resume'
import Navigation from '../../Navigation'
import './AllResumes.css'

export default function AllResumes() {
  const dispatch = useDispatch();
  const { setSelectedLink } = useMenuSelector()
  const [state, setState] = useState({ isLoaded: false, error: false })
  const allResumes = useSelector(state => state.resumes?.allResumes)
  const allResumesArray = Object.values(allResumes)

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchAllResumesThunk())
      if (response.error) {
        setState({ isLoaded: true, error: true })
      } else {
        setState({ isLoaded: true, error: false })
      }
      await setSelectedLink('resumes')
    }
    fetchAsync()
  }, [])

  const capitalizeResumeTitle = (string) => {
    const output = []
    const arr = string?.split(' ')
    arr?.forEach(word => output.push(word[0]?.toUpperCase() + word.slice(1)?.toLowerCase()))
    return output.join(' ');
  }

  const numberToRoman = (num) => {
    const romanNumerals = [
      ['M', 1000],
      ['CM', 900],
      ['D', 500],
      ['CD', 400],
      ['C', 100],
      ['XC', 90],
      ['L', 50],
      ['XL', 40],
      ['X', 10],
      ['IX', 9],
      ['V', 5],
      ['IV', 4],
      ['I', 1],
    ];
    let roman = '';
    for (const [numeral, value] of romanNumerals) {
      while (num >= value) {
        roman += numeral;
        num -= value;
      }
    }
    return roman;
  }

  const getRomanIndex = (currentResume) => {
    let count = 0;
    for (const resume of allResumesArray) {
      if (resume.position_type === currentResume.position_type) {
        count++;
        if (resume.id === currentResume.id) {
          break;
        }
      }
    }
    return count;
  };

  return (
    <>
      <Navigation />
      { state.isLoaded && !state.error && (
        <div className="all-resumes-page-container">
          <div className="all-resumes-body">
            <h1><span className="form-action">Manage</span> <span className="form-title">Resumes</span></h1>
            <div>Select a resume to view</div>
            <div className='resume-input-box'>
              <div className="input-msg">Choose a resume</div>
              <div className="resumes-container">
                { Object.values(allResumes).map(resume => (
                  <div key={resume.id} className="resume-overview">
                    <div className="resume-left">
                      <div className="resume-name">
                        {`${capitalizeResumeTitle(resume.position_type)} Resume ${numberToRoman(getRomanIndex(resume))}`}
                      </div>
                      <div className="resume-date">{resume.created_at}</div>
                    </div>
                    <div className="resume-right">
                      <button className="view-button">View</button>
                      <button className="edit-button">Edit</button>
                      <button className="delete-button">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      { state.isLoaded && state.error && (
        <div className="all-resumes-container">
        <div className="all-resumes-body">
          <h3>No resumes found, please try again momentarily</h3>
        </div>
      </div>
      )}
    </>
  )
}
