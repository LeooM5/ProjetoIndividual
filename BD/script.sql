create database projetoPessoal;

use projetoPessoal;

CREATE TABLE usuario (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(75),
    senha VARCHAR(25),
    termos TINYINT
);
  
SELECT 
    *
FROM
    usuario;

CREATE TABLE partida (
    idPartida INT PRIMARY KEY AUTO_INCREMENT,
    dataPartida DATE NOT NULL,
    tipoPartida VARCHAR(20) NOT NULL
);

CREATE TABLE estatistica (
    idEstatistica INT PRIMARY KEY AUTO_INCREMENT,
    chutesRecebidos INT,
    penaltisPartida INT,
    golsSofridos INT,
    golsPenalti INT,
    fkUsuario INT NOT NULL,
    fkPartida INT NOT NULL,
    FOREIGN KEY (fkUsuario)
        REFERENCES usuario(idUsuario),
    FOREIGN KEY (fkPartida)
        REFERENCES partida(idPartida)
);